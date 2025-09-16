// controllers/adminComplaint.controller.js
import mongoose from "mongoose";
import "dotenv/config";
import { Complaint } from "../models/complaint.model.js"; // adjust path if different
import { Transform } from "stream";

// Helpers
function parseDateRange(query) {
  const { from, to } = query;
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return Object.keys(range).length ? range : undefined;
}

function buildMatchFromQuery(query) {
  const match = {};

  const createdAtRange = parseDateRange(query);
  if (createdAtRange) match.createdAt = createdAtRange;

  if (query.status) match.status = query.status;
  if (query.priority) match.priority = query.priority;
  if (query.departmentName) match.departmentName = query.departmentName;
  if (query.zone) match.zone = query.zone;

  if (query.breachedOnly === "true") match["sla.breached"] = true;
  if (query.escalatedOnly === "true") {
    // Either escalated status or escalation flag
    match.$or = [{ status: "escalated" }, { "escalation.isEscalated": true }];
  }

  if (query.withMediaOnly === "true") {
    match.$or = [
      ...(match.$or || []),
      { "media.images.0": { $exists: true } },
      { "media.videos.0": { $exists: true } },
    ];
  }

  return match;
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Utility to safely numeric format
function num(v) {
  return v === null || v === undefined ? null : Number(Number(v).toFixed(2));
}

// Helper to convert objects to CSV
function objectsToCSV(objects, headers) {
  if (!objects.length) return "";

  const csvHeaders = headers || Object.keys(objects[0]);
  const csvRows = [csvHeaders.join(",")];

  objects.forEach((obj) => {
    const row = csvHeaders.map((header) => {
      const value = obj[header];
      if (value === null || value === undefined) return "";
      // Escape commas and quotes
      const stringValue = String(value).replace(/"/g, '""');
      return stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
        ? `"${stringValue}"`
        : stringValue;
    });
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

// GET /analytics/overview
export async function getOverviewAnalytics(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);

    // Precompute for resolution metrics
    const basePipeline = [{ $match: match }];

    const [
      totals,
      statusDist,
      priorityDist,
      slaStats,
      escalationStats,
      resolutionStats,
      mediaStats,
    ] = await Promise.all([
      // totals
      Complaint.countDocuments(match),

      // status distribution
      Complaint.aggregate([
        ...basePipeline,
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // priority distribution
      Complaint.aggregate([
        ...basePipeline,
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),

      // SLA: breached count
      Complaint.aggregate([
        ...basePipeline,
        {
          $group: {
            _id: null,
            breached: {
              $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
            },
          },
        },
      ]),

      // Escalations
      Complaint.aggregate([
        ...basePipeline,
        {
          $group: {
            _id: null,
            totalEscalated: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$status", "escalated"] },
                      { $eq: ["$escalation.isEscalated", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            system: {
              $sum: {
                $cond: [{ $eq: ["$escalation.type", "system"] }, 1, 0],
              },
            },
            officer: {
              $sum: {
                $cond: [{ $eq: ["$escalation.type", "officer"] }, 1, 0],
              },
            },
          },
        },
      ]),

      // Resolution metrics: avg only (compatible with all MongoDB versions)
      Complaint.aggregate([
        ...basePipeline,
        { $match: { ...match, resolvedAt: { $ne: null } } },
        {
          $project: {
            _id: 0,
            resolutionHours: {
              $divide: [
                { $subtract: ["$resolvedAt", "$createdAt"] },
                1000 * 60 * 60,
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgHours: { $avg: "$resolutionHours" },
            count: { $sum: 1 },
          },
        },
      ]),

      // Media presence ratio
      Complaint.aggregate([
        ...basePipeline,
        {
          $group: {
            _id: null,
            withMedia: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      {
                        $gt: [{ $size: { $ifNull: ["$media.images", []] } }, 0],
                      },
                      {
                        $gt: [{ $size: { $ifNull: ["$media.videos", []] } }, 0],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const breached = slaStats?.[0]?.breached || 0;
    const totalEscalated = escalationStats?.[0]?.totalEscalated || 0;
    const systemEsc = escalationStats?.system || 0;
    const officerEsc = escalationStats?.officer || 0;

    const avgHours = resolutionStats?.avgHours ?? null;
    const resolvedCount = resolutionStats?.count || 0;

    const withMedia = mediaStats?.withMedia || 0;
    const mediaTotal = mediaStats?.otal || 0;

    res.json({
      success: true,
      filters: req.query,
      totals,
      status: statusDist.map((s) => ({ status: s._id, count: s.count })),
      priority: priorityDist.map((p) => ({ priority: p._id, count: p.count })),
      sla: {
        breached,
        breachRate: totals ? Number(((breached / totals) * 100).toFixed(2)) : 0,
      },
      escalations: {
        total: totalEscalated,
        system: systemEsc,
        officer: officerEsc,
      },
      resolutionTime: {
        avgHours: avgHours !== null ? Number(avgHours.toFixed(2)) : null,
        resolvedCount: resolvedCount,
      },
      media: {
        withMedia,
        ratio: mediaTotal
          ? Number(((withMedia / mediaTotal) * 100).toFixed(2))
          : 0,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Analytics error", error: err.message });
  }
}

// GET /complaints
export async function listComplaints(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);

    const page = toNumber(req.query.page, 1);
    const limit = Math.min(toNumber(req.query.limit, 20), 100);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Projection for list
    const projection = {
      title: 1,
      category: 1,
      departmentName: 1,
      priority: 1,
      status: 1,
      zone: 1,
      createdAt: 1,
      resolvedAt: 1,
      "sla.breached": 1,
      "escalation.isEscalated": 1,
      "escalation.type": 1,
    };

    const [items, total] = await Promise.all([
      Complaint.find(match, projection)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(match),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      items,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "List error", error: err.message });
  }
}

// GET /complaints/:id
export async function getComplaintById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid complaint id" });
    }

    const doc = await Complaint.findById(id).lean();
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, item: doc });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Detail error", error: err.message });
  }
}

// GET /analytics/departments
export async function getDepartmentAnalytics(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);

    const pipeline = [
      { $match: match },
      {
        $facet: {
          byDept: [
            {
              $group: {
                _id: "$departmentName",
                total: { $sum: 1 },
                pending: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                in_progress: {
                  $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
                },
                resolved: {
                  $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
                },
                rejected: {
                  $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
                },
                escalated: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$status", "escalated"] },
                          { $eq: ["$escalation.isEscalated", true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                slaBreached: {
                  $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
                },
                systemEsc: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "system"] }, 1, 0],
                  },
                },
                officerEsc: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "officer"] }, 1, 0],
                  },
                },
                low: { $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] } },
                medium: {
                  $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
                },
                high: {
                  $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
                },
                urgent: {
                  $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
                },
                // resolution stats
                avgResolutionHours: {
                  $avg: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ["$resolvedAt", null] },
                          { $ne: ["$resolvedAt", undefined] },
                        ],
                      },
                      {
                        $divide: [
                          { $subtract: ["$resolvedAt", "$createdAt"] },
                          1000 * 60 * 60,
                        ],
                      },
                      null,
                    ],
                  },
                },
              },
            },
            { $sort: { total: -1 } },
          ],
          byCategoryPerDept: [
            {
              $group: {
                _id: {
                  departmentName: "$departmentName",
                  category: "$category",
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            {
              $group: {
                _id: "$_id.departmentName",
                topCategories: {
                  $push: { category: "$_id.category", count: "$count" },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          byDept: 1,
          byCategoryPerDept: 1,
        },
      },
    ];

    const [result] = await Complaint.aggregate(pipeline);
    const catMap = new Map();
    (result.byCategoryPerDept || []).forEach((row) =>
      catMap.set(row._id, row.topCategories)
    );

    const items = (result.byDept || []).map((d) => ({
      departmentName: d._id || "Unknown",
      totals: {
        total: d.total,
        pending: d.pending,
        in_progress: d.in_progress,
        resolved: d.resolved,
        rejected: d.rejected,
        escalated: d.escalated,
      },
      sla: {
        breached: d.slaBreached,
        breachRate: d.total ? num((d.slaBreached / d.total) * 100) : 0,
      },
      escalations: {
        system: d.systemEsc,
        officer: d.officerEsc,
      },
      priority: {
        low: d.low,
        medium: d.medium,
        high: d.high,
        urgent: d.urgent,
      },
      resolution: { avgHours: num(d.avgResolutionHours) },
      topCategories: (catMap.get(d._id) || []).slice(0, 5),
    }));

    res.json({ success: true, filters: req.query, items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Department analytics error",
      error: err.message,
    });
  }
}

// GET /analytics/zones
export async function getZoneAnalytics(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$zone",
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          in_progress: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
          },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          escalated: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "escalated"] },
                    { $eq: ["$escalation.isEscalated", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          slaBreached: {
            $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
          },
          avgResolutionHours: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$resolvedAt", null] },
                    { $ne: ["$resolvedAt", undefined] },
                  ],
                },
                {
                  $divide: [
                    { $subtract: ["$resolvedAt", "$createdAt"] },
                    1000 * 60 * 60,
                  ],
                },
                null,
              ],
            },
          },
          low: { $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ];

    const rows = await Complaint.aggregate(pipeline);
    const items = rows.map((z) => ({
      zone: z._id || "Unknown",
      totals: {
        total: z.total,
        pending: z.pending,
        in_progress: z.in_progress,
        resolved: z.resolved,
        rejected: z.rejected,
        escalated: z.escalated,
      },
      sla: {
        breached: z.slaBreached,
        breachRate: z.total ? num((z.slaBreached / z.total) * 100) : 0,
      },
      resolution: { avgHours: num(z.avgResolutionHours) },
      priority: {
        low: z.low,
        medium: z.medium,
        high: z.high,
        urgent: z.urgent,
      },
    }));

    res.json({ success: true, filters: req.query, items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Zone analytics error",
      error: err.message,
    });
  }
}

// GET /analytics/trends
// interval: day|week|month (default: day). Buckets by createdAt.
export async function getTrends(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const interval = ["day", "week", "month"].includes(req.query.interval)
      ? req.query.interval
      : "day";

    // Alternative approach for older MongoDB versions using $dateToString
    let dateFormat;
    switch (interval) {
      case "week":
        dateFormat = "%Y-W%U"; // Year-WeekNumber
        break;
      case "month":
        dateFormat = "%Y-%m"; // Year-Month
        break;
      default:
        dateFormat = "%Y-%m-%d"; // Year-Month-Day
    }

    const base = [{ $match: match }];

    const createdTrend = await Complaint.aggregate([
      ...base,
      {
        $project: {
          bucket: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        },
      },
      { $group: { _id: "$bucket", created: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const resolvedTrend = await Complaint.aggregate([
      ...base,
      { $match: { ...match, resolvedAt: { $ne: null } } },
      {
        $project: {
          bucket: {
            $dateToString: { format: dateFormat, date: "$resolvedAt" },
          },
        },
      },
      { $group: { _id: "$bucket", resolved: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const slaBreachTrend = await Complaint.aggregate([
      ...base,
      { $match: { ...match, "sla.breached": true } },
      {
        $project: {
          bucket: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        },
      },
      { $group: { _id: "$bucket", slaBreached: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const escalatedTrend = await Complaint.aggregate([
      ...base,
      {
        $match: {
          ...match,
          $or: [{ status: "escalated" }, { "escalation.isEscalated": true }],
        },
      },
      {
        $project: {
          bucket: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        },
      },
      { $group: { _id: "$bucket", escalated: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      filters: req.query,
      interval,
      created: createdTrend.map((d) => ({ bucket: d._id, count: d.created })),
      resolved: resolvedTrend.map((d) => ({
        bucket: d._id,
        count: d.resolved,
      })),
      slaBreached: slaBreachTrend.map((d) => ({
        bucket: d._id,
        count: d.slaBreached,
      })),
      escalated: escalatedTrend.map((d) => ({
        bucket: d._id,
        count: d.escalated,
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Trends error", error: err.message });
  }
}

// GET /analytics/escalations
export async function getEscalationAnalytics(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);

    const pipeline = [
      { $match: match },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                escalated: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$status", "escalated"] },
                          { $eq: ["$escalation.isEscalated", true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                system: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "system"] }, 1, 0],
                  },
                },
                officer: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "officer"] }, 1, 0],
                  },
                },
              },
            },
          ],
          byDept: [
            {
              $group: {
                _id: "$departmentName",
                escalated: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$status", "escalated"] },
                          { $eq: ["$escalation.isEscalated", true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                system: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "system"] }, 1, 0],
                  },
                },
                officer: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "officer"] }, 1, 0],
                  },
                },
                total: { $sum: 1 },
              },
            },
            { $sort: { escalated: -1 } },
          ],
          byZone: [
            {
              $group: {
                _id: "$zone",
                escalated: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$status", "escalated"] },
                          { $eq: ["$escalation.isEscalated", true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                system: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "system"] }, 1, 0],
                  },
                },
                officer: {
                  $sum: {
                    $cond: [{ $eq: ["$escalation.type", "officer"] }, 1, 0],
                  },
                },
                total: { $sum: 1 },
              },
            },
            { $sort: { escalated: -1 } },
          ],
        },
      },
    ];

    const [resAgg] = await Complaint.aggregate(pipeline);
    const totals = resAgg.totals?.[0] || {
      total: 0,
      escalated: 0,
      system: 0,
      officer: 0,
    };

    res.json({
      success: true,
      filters: req.query,
      totals: {
        total: totals.total,
        escalated: totals.escalated,
        system: totals.system,
        officer: totals.officer,
        escalationRate: totals.total
          ? num((totals.escalated / totals.total) * 100)
          : 0,
      },
      byDepartment: (resAgg.byDept || []).map((d) => ({
        departmentName: d._id || "Unknown",
        total: d.total,
        escalated: d.escalated,
        system: d.system,
        officer: d.officer,
        rate: d.total ? num((d.escalated / d.total) * 100) : 0,
      })),
      byZone: (resAgg.byZone || []).map((z) => ({
        zone: z._id || "Unknown",
        total: z.total,
        escalated: z.escalated,
        system: z.system,
        officer: z.officer,
        rate: z.total ? num((z.escalated / z.total) * 100) : 0,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Escalation analytics error",
      error: err.message,
    });
  }
}

// GET /reports/complaints - Export complaints list
export async function exportComplaints(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const format = req.query.format === "csv" ? "csv" : "json";
    const limit = Math.min(toNumber(req.query.limit, 1000), 5000); // cap for performance

    const projection = {
      _id: 1,
      title: 1,
      description: 1,
      category: 1,
      departmentName: 1,
      priority: 1,
      status: 1,
      zone: 1,
      createdAt: 1,
      resolvedAt: 1,
      "sla.breached": 1,
      "sla.dueAt": 1,
      "escalation.isEscalated": 1,
      "escalation.type": 1,
      "escalation.at": 1,
      "escalation.reason": 1,
      "feedback.rating": 1,
    };

    const items = await Complaint.find(match, projection)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Flatten for export
    const flatItems = items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      departmentName: item.departmentName,
      priority: item.priority,
      status: item.status,
      zone: item.zone,
      createdAt: item.createdAt,
      resolvedAt: item.resolvedAt || "",
      slaBreached: item.sla?.breached || false,
      slaDueAt: item.sla?.dueAt || "",
      escalated: item.escalation?.isEscalated || false,
      escalationType: item.escalation?.type || "",
      escalatedAt: item.escalation?.at || "",
      escalationReason: item.escalation?.reason || "",
      feedbackRating: item.feedback?.rating || "",
    }));

    if (format === "csv") {
      const csv = objectsToCSV(flatItems);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="complaints-export.csv"'
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      format,
      count: flatItems.length,
      items: flatItems,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Export error", error: err.message });
  }
}

// GET /reports/departments - Export department analytics
export async function exportDepartments(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const format = req.query.format === "csv" ? "csv" : "json";

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$departmentName",
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          in_progress: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
          },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          escalated: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "escalated"] },
                    { $eq: ["$escalation.isEscalated", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          slaBreached: {
            $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
          },
          avgResolutionHours: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$resolvedAt", null] },
                    { $ne: ["$resolvedAt", undefined] },
                  ],
                },
                {
                  $divide: [
                    { $subtract: ["$resolvedAt", "$createdAt"] },
                    1000 * 60 * 60,
                  ],
                },
                null,
              ],
            },
          },
          urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ];

    const rows = await Complaint.aggregate(pipeline);
    const items = rows.map((d) => ({
      departmentName: d._id || "Unknown",
      total: d.total,
      pending: d.pending,
      inProgress: d.in_progress,
      resolved: d.resolved,
      rejected: d.rejected,
      escalated: d.escalated,
      slaBreached: d.slaBreached,
      breachRate: d.total ? num((d.slaBreached / d.total) * 100) : 0,
      avgResolutionHours: num(d.avgResolutionHours),
      urgent: d.urgent,
      high: d.high,
    }));

    if (format === "csv") {
      const csv = objectsToCSV(items);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="departments-export.csv"'
      );
      return res.send(csv);
    }

    res.json({ success: true, format, count: items.length, items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Department export error",
      error: err.message,
    });
  }
}

// GET /reports/zones - Export zone analytics
export async function exportZones(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const format = req.query.format === "csv" ? "csv" : "json";

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$zone",
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          escalated: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "escalated"] },
                    { $eq: ["$escalation.isEscalated", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          slaBreached: {
            $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
          },
          avgResolutionHours: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$resolvedAt", null] },
                    { $ne: ["$resolvedAt", undefined] },
                  ],
                },
                {
                  $divide: [
                    { $subtract: ["$resolvedAt", "$createdAt"] },
                    1000 * 60 * 60,
                  ],
                },
                null,
              ],
            },
          },
        },
      },
      { $sort: { total: -1 } },
    ];

    const rows = await Complaint.aggregate(pipeline);
    const items = rows.map((z) => ({
      zone: z._id || "Unknown",
      total: z.total,
      pending: z.pending,
      resolved: z.resolved,
      escalated: z.escalated,
      slaBreached: z.slaBreached,
      breachRate: z.total ? num((z.slaBreached / z.total) * 100) : 0,
      avgResolutionHours: num(z.avgResolutionHours),
    }));

    if (format === "csv") {
      const csv = objectsToCSV(items);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="zones-export.csv"'
      );
      return res.send(csv);
    }

    res.json({ success: true, format, count: items.length, items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Zone export error",
      error: err.message,
    });
  }
}

// GET /reports/escalations - Export escalated complaints
export async function exportEscalations(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const format = req.query.format === "csv" ? "csv" : "json";

    // Only escalated complaints
    const escalatedMatch = {
      ...match,
      $or: [{ status: "escalated" }, { "escalation.isEscalated": true }],
    };

    const projection = {
      _id: 1,
      title: 1,
      category: 1,
      departmentName: 1,
      priority: 1,
      status: 1,
      zone: 1,
      createdAt: 1,
      "sla.breached": 1,
      "sla.dueAt": 1,
      "escalation.type": 1,
      "escalation.at": 1,
      "escalation.reason": 1,
      "escalation.fromDeptName": 1,
    };

    const items = await Complaint.find(escalatedMatch, projection)
      .sort({ "escalation.at": -1 })
      .limit(1000)
      .lean();

    const flatItems = items.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category,
      departmentName: item.departmentName,
      priority: item.priority,
      status: item.status,
      zone: item.zone,
      createdAt: item.createdAt,
      slaBreached: item.sla?.breached || false,
      slaDueAt: item.sla?.dueAt || "",
      escalationType: item.escalation?.type || "",
      escalatedAt: item.escalation?.at || "",
      escalationReason: item.escalation?.reason || "",
      fromDeptName: item.escalation?.fromDeptName || "",
    }));

    if (format === "csv") {
      const csv = objectsToCSV(flatItems);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="escalations-export.csv"'
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      format,
      count: flatItems.length,
      items: flatItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Escalations export error",
      error: err.message,
    });
  }
}

// GET /reports/resolutions - Export resolved complaints with resolution times
export async function exportResolutions(req, res) {
  try {
    const match = buildMatchFromQuery(req.query);
    const format = req.query.format === "csv" ? "csv" : "json";

    const resolvedMatch = {
      ...match,
      status: "resolved",
      resolvedAt: { $ne: null },
    };

    const pipeline = [
      { $match: resolvedMatch },
      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          departmentName: 1,
          priority: 1,
          zone: 1,
          createdAt: 1,
          resolvedAt: 1,
          resolutionHours: {
            $divide: [
              { $subtract: ["$resolvedAt", "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
          "sla.breached": 1,
          "feedback.rating": 1,
        },
      },
      { $sort: { resolvedAt: -1 } },
      { $limit: 1000 },
    ];

    const items = await Complaint.aggregate(pipeline);
    const flatItems = items.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category,
      departmentName: item.departmentName,
      priority: item.priority,
      zone: item.zone,
      createdAt: item.createdAt,
      resolvedAt: item.resolvedAt,
      resolutionHours: num(item.resolutionHours),
      slaBreached: item.sla?.breached || false,
      feedbackRating: item.feedback?.rating || "",
    }));

    if (format === "csv") {
      const csv = objectsToCSV(flatItems);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="resolutions-export.csv"'
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      format,
      count: flatItems.length,
      items: flatItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Resolutions export error",
      error: err.message,
    });
  }
}

// GET /analytics/ai/department - AI Analysis for department
export async function getAIDepartmentAnalysis(req, res) {
  try {
    const { departmentName } = req.query;
    if (!departmentName) {
      return res.status(400).json({
        success: false,
        message: "departmentName query parameter required",
      });
    }

    // Check if AI is enabled
    const AI_ENABLED = process.env.ENABLE_AI_ANALYSIS === "true";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const match = buildMatchFromQuery(req.query);
    match.departmentName = departmentName; // ensure department filter

    // Gather metrics first
    const [
      totals,
      statusDist,
      priorityDist,
      slaStats,
      categoryStats,
      sampleComplaints,
    ] = await Promise.all([
      Complaint.countDocuments(match),

      Complaint.aggregate([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      Complaint.aggregate([
        { $match: match },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),

      Complaint.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            breached: {
              $sum: { $cond: [{ $eq: ["$sla.breached", true] }, 1, 0] },
            },
            escalated: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$status", "escalated"] },
                      { $eq: ["$escalation.isEscalated", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      Complaint.aggregate([
        { $match: match },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Sample complaints for AI (limit for cost control)
      Complaint.find(match, {
        _id: 1,
        title: 1,
        description: 1,
        category: 1,
        status: 1,
        priority: 1,
        zone: 1,
        createdAt: 1,
        resolvedAt: 1,
        "sla.breached": 1,
        "escalation.type": 1,
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),
    ]);

    const metrics = {
      total: totals,
      status: statusDist.map((s) => ({ status: s._id, count: s.count })),
      priority: priorityDist.map((p) => ({ priority: p._id, count: p.count })),
      sla: {
        breached: slaStats?.[0]?.breached || 0,
        breachRate: totals
          ? num(((slaStats?.breached || 0) / totals) * 100)
          : 0,
      },
      escalations: {
        total: slaStats?.escalated || 0,
        rate: totals ? num(((slaStats?.escalated || 0) / totals) * 100) : 0,
      },
      topCategories: categoryStats.map((c) => ({
        category: c._id,
        count: c.count,
      })),
    };

    // Generate key findings from data
    const keyFindings = [];

    if (metrics.sla.breachRate > 10) {
      keyFindings.push(
        `High SLA breach rate: ${metrics.sla.breachRate}% of complaints exceed time limits`
      );
    }

    if (metrics.escalations.rate > 5) {
      keyFindings.push(
        `Significant escalation rate: ${metrics.escalations.rate}% of complaints require escalation`
      );
    }

    const urgentHigh =
      metrics.priority.find((p) => p.priority === "urgent")?.count || 0;
    const highPri =
      metrics.priority.find((p) => p.priority === "high")?.count || 0;
    if ((urgentHigh + highPri) / totals > 0.3) {
      keyFindings.push(
        `High proportion of urgent/high priority complaints: ${
          urgentHigh + highPri
        } out of ${totals}`
      );
    }

    if (metrics.topCategories.length > 0) {
      const topCat = metrics.topCategories[0];
      keyFindings.push(
        `Most common issue: ${topCat.category} (${topCat.count} complaints)`
      );
    }

    // Prepare AI summary
    let aiSummary = "AI analysis unavailable";

    if (AI_ENABLED && GEMINI_API_KEY) {
      try {
        // Prepare compact data for AI
        const compactComplaints = sampleComplaints.map((c) => ({
          title: c.title,
          category: c.category,
          priority: c.priority,
          status: c.status,
          zone: c.zone,
          slaBreached: c.sla?.breached || false,
          escalationType: c.escalation?.type || null,
        }));

        const aiPayload = {
          department: departmentName,
          timeRange:
            req.query.from && req.query.to
              ? `${req.query.from} to ${req.query.to}`
              : "All time",
          metrics,
          sampleSize: compactComplaints.length,
          complaints: compactComplaints,
        };

        // Call AI service
        aiSummary = await generateAIAnalysis(aiPayload);
      } catch (aiError) {
        console.error("AI analysis failed:", aiError.message);
        aiSummary = "AI analysis failed - using data-driven insights only";
      }
    }

    res.json({
      success: true,
      department: departmentName,
      filters: req.query,
      metrics,
      keyFindings,
      aiSummary,
      sampleSize: sampleComplaints.length,
      aiEnabled: AI_ENABLED,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "AI analysis error",
      error: err.message,
    });
  }
}

// AI Service function (implement based on your provider)
async function generateAIAnalysis(data) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `Analyze the following civic complaint data for ${
    data.department
  } department and provide a concise analysis:

**Department:** ${data.department}
**Time Range:** ${data.timeRange}
**Total Complaints:** ${data.metrics.total}

**Metrics:**
- Status Distribution: ${data.metrics.status
    .map((s) => `${s.status}: ${s.count}`)
    .join(", ")}
- Priority Distribution: ${data.metrics.priority
    .map((p) => `${p.priority}: ${p.count}`)
    .join(", ")}
- SLA Breach Rate: ${data.metrics.sla.breachRate}%
- Escalation Rate: ${data.metrics.escalations.rate}%
- Top Categories: ${data.metrics.topCategories
    .slice(0, 3)
    .map((c) => `${c.category} (${c.count})`)
    .join(", ")}

**Sample Complaints:** ${data.complaints
    .slice(0, 10)
    .map(
      (c) =>
        `"${c.title}" - ${c.category}, ${c.priority} priority, ${c.status}, Zone: ${c.zone}`
    )
    .join(" | ")}

Please provide:
1. **Core Issues**
2. **Performance Assessment**
3. **Hotspots**
4. **Recommendations**

Keep response under 400 words and focus on data-driven insights.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates[0] &&
      result.candidates[0].content?.parts?.[0]?.text
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error(
        "Unexpected Gemini response:",
        JSON.stringify(result, null, 2)
      );
      throw new Error("Invalid response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI analysis");
  }
}

// controllers/superAdminController.js
export const getHeatMapData = async (req, res) => {
  try {
    const { departmentName, status, priority, limit = 1000 } = req.query;

    // Build match query
    const match = {};

    if (departmentName) match.departmentName = departmentName;
    if (status) match.status = status;
    if (priority) match.priority = priority;

    // Ensure valid location
    match["location.lat"] = { $exists: true, $ne: null };
    match["location.lng"] = { $exists: true, $ne: null };

    // Sanitize limit (max 5000 for safety)
    const safeLimit = Math.min(parseInt(limit) || 1000, 5000);

    const complaints = await Complaint.find(match)
      .select("title departmentName status priority location createdAt")
      .limit(safeLimit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Heat map data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch heat map data",
      error: error.message,
    });
  }
};

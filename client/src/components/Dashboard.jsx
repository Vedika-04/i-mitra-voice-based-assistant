import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import {
  getMySummary,
  getMyComplaints,
  getComplaintDetails,
  createComplaint,
} from "../services/complaintApi";
import { getDeptAndCatJSON } from "../services/Aiservice";

const StatusPill = ({ status }) => {
  const map = {
    pending: "bg-gray-500",
    in_progress: "bg-blue-600",
    resolved: "bg-emerald-600",
    escalated: "bg-amber-600",
    rejected: "bg-rose-600",
  };
  const cls = map[status] || "bg-gray-500";
  return (
    <span
      className={`${cls} text-white rounded-full px-2.5 py-1 text-xs capitalize`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useContext(Context);

  // Summary
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // List
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    sort: "-createdAt",
  });
  const [loadingList, setLoadingList] = useState(false);

  // Details modal
  const [selectedId, setSelectedId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // File complaint modal
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileForm, setFileForm] = useState({
    title: "",
    description: "",
    addressManual: "",
    gmapLink: "",
    images: [],
    videos: [],
  });
  const [submitting, setSubmitting] = useState(false);

  // Load summary on mount
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoadingSummary(true);
        const data = await getMySummary();
        setSummary(data.summary);
      } catch {
        toast.error("Failed to load summary");
      } finally {
        setLoadingSummary(false);
      }
    };
    loadSummary();
  }, []);

  const loadList = async (page = 1, limit = 10) => {
    try {
      setLoadingList(true);
      const params = { page, limit, sort: filters.sort };
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const data = await getMyComplaints(params);
      setItems(data.items || []);
      setPagination(
        data.pagination || { page, limit, total: 0, hasMore: false }
      );
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList(pagination.page, pagination.limit);
  }, [filters]);

  const openDetails = async (complaintId) => {
    try {
      setSelectedId(complaintId);
      setLoadingDetails(true);
      const data = await getComplaintDetails(complaintId);
      setSelectedComplaint(data.complaint);
    } catch {
      toast.error("Failed to load complaint details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedId(null);
    setSelectedComplaint(null);
  };

  const onFilesChange = (e) => {
    const { name, files } = e.target;
    setFileForm((f) => ({ ...f, [name]: Array.from(files) }));
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!fileForm.title.trim() || !fileForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    try {
      setSubmitting(true);
      const ai = await getDeptAndCatJSON({
        title: fileForm.title,
        description: fileForm.description,
      });

      const fd = new FormData();
      fd.append("title", fileForm.title);
      fd.append("description", fileForm.description);
      if (fileForm.addressManual)
        fd.append("location[addressManual]", fileForm.addressManual);
      if (fileForm.gmapLink) fd.append("location[gmapLink]", fileForm.gmapLink);
      (fileForm.images || []).forEach((f) => fd.append("images", f));
      (fileForm.videos || []).forEach((f) => fd.append("videos", f));
      fd.append("aiSuggestion", JSON.stringify(ai));

      await createComplaint(fd);
      toast.success("Complaint filed");
      setShowFileModal(false);
      setFileForm({
        title: "",
        description: "",
        addressManual: "",
        gmapLink: "",
        images: [],
        videos: [],
      });
      await loadList(1, pagination.limit);
      const sum = await getMySummary();
      setSummary(sum.summary);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = useMemo(
    () => ["", "pending", "in_progress", "resolved", "rejected", "escalated"],
    []
  );

  return (
    <div className="grid gap-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
        {user?.profileimg ? (
          <img
            src={user.profileimg}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
            {user?.fullName?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h2 className="m-0 text-xl font-semibold">
            Welcome, {user?.fullName || "Citizen"}
          </h2>
          <div className="text-sm text-gray-600">
            <span>{user?.email}</span> · <span>{user?.phone}</span> ·{" "}
            <span>Zone: {user?.zone}</span>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowFileModal(true)}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            File a Complaint
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loadingSummary ? (
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
            Loading summary...
          </div>
        ) : (
          <>
            <Card title="Total" value={summary?.total ?? 0} />
            <Card title="Open" value={summary?.open ?? 0} />
            <Card title="Resolved" value={summary?.resolved ?? 0} />
            <Card title="Escalated" value={summary?.escalated ?? 0} />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
        <select
          className="w-48 rounded-md border px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          {statusOptions.map((s) => (
            <option key={s || "all"} value={s}>
              {s ? s.replace("_", " ") : "All statuses"}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="rounded-md border px-3 py-2 text-sm"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
        />
        <input
          type="date"
          className="rounded-md border px-3 py-2 text-sm"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
        />
        <button
          onClick={() => loadList(1, pagination.limit)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Apply
        </button>
      </div>

      {/* Complaints table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        {loadingList ? (
          <div className="p-4 text-sm text-gray-600">Loading complaints...</div>
        ) : items.length === 0 ? (
          <EmptyState onCreate={() => setShowFileModal(true)} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Created</th>
                <th className="p-3">Resolved</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.complaintId} className="border-b last:border-b-0">
                  <td className="p-3 font-mono">{c.complaintId}</td>
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.departmentName}</td>
                  <td className="p-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="p-3 capitalize">{c.priority}</td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {c.resolvedAt
                      ? new Date(c.resolvedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => openDetails(c.complaintId)}
                      className="rounded-md border px-3 py-1.5 hover:bg-gray-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => loadList(pagination.page - 1, pagination.limit)}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.page} /{" "}
            {Math.max(
              1,
              Math.ceil((pagination.total || 0) / (pagination.limit || 10))
            )}
          </span>
          <button
            disabled={!pagination.hasMore}
            onClick={() => loadList(pagination.page + 1, pagination.limit)}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* File Complaint Modal */}
      {showFileModal && (
        <Modal onClose={() => setShowFileModal(false)} title="File a Complaint">
          <form onSubmit={submitComplaint} className="grid gap-3">
            <input
              type="text"
              placeholder="Title"
              value={fileForm.title}
              onChange={(e) =>
                setFileForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
            <textarea
              placeholder="Description"
              value={fileForm.description}
              onChange={(e) =>
                setFileForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={5}
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Address (optional)"
              value={fileForm.addressManual}
              onChange={(e) =>
                setFileForm((f) => ({ ...f, addressManual: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Google Maps link (optional)"
              value={fileForm.gmapLink}
              onChange={(e) =>
                setFileForm((f) => ({ ...f, gmapLink: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <div className="grid gap-1">
              <label className="text-sm text-gray-700">Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={onFilesChange}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm text-gray-700">Videos</label>
              <input
                type="file"
                name="videos"
                multiple
                accept="video/*"
                onChange={onFilesChange}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFileModal(false)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Complaint Details Modal */}
      {selectedId && (
        <Modal onClose={closeDetails} title={`Complaint ${selectedId}`}>
          {loadingDetails ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : !selectedComplaint ? (
            <div className="text-sm text-gray-600">Not found</div>
          ) : (
            <div className="grid gap-3 text-sm">
              <div>
                <span className="font-medium">Title:</span>{" "}
                {selectedComplaint.title}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {selectedComplaint.description}
              </div>
              <div>
                <span className="font-medium">Department:</span>{" "}
                {selectedComplaint.departmentName}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {selectedComplaint.category}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <StatusPill status={selectedComplaint.status} />
              </div>
              <div>
                <span className="font-medium">Priority:</span>{" "}
                {selectedComplaint.priority}
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {selectedComplaint.location?.gmapLink ? (
                  <a
                    className="text-blue-600 underline"
                    href={selectedComplaint.location.gmapLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Map
                  </a>
                ) : (
                  "—"
                )}
              </div>

              {selectedComplaint.media?.images?.length > 0 && (
                <div className="grid gap-2">
                  <span className="font-medium">Images:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedComplaint.media.images.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="h-24 w-36 rounded-md object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedComplaint.media?.videos?.length > 0 && (
                <div className="grid gap-2">
                  <span className="font-medium">Videos:</span>
                  <div className="grid gap-2">
                    {selectedComplaint.media.videos.map((src) => (
                      <video
                        key={src}
                        src={src}
                        controls
                        className="w-full max-w-md rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(selectedComplaint.timeline) &&
                selectedComplaint.timeline.length > 0 && (
                  <div className="grid gap-2">
                    <span className="font-medium">Timeline:</span>
                    <div className="grid gap-2">
                      {selectedComplaint.timeline.map((t, idx) => (
                        <div key={idx} className="rounded-lg border p-2">
                          <div className="text-xs text-gray-600">
                            {new Date(t.at).toLocaleString()}
                          </div>
                          {t.caption && <div className="mt-1">{t.caption}</div>}
                          {Array.isArray(t.media) && t.media.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {t.media.map((m, i) =>
                                m.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video
                                    key={i}
                                    src={m}
                                    controls
                                    className="w-40 rounded-md"
                                  />
                                ) : (
                                  <img
                                    key={i}
                                    src={m}
                                    alt=""
                                    className="h-20 w-28 rounded-md object-cover"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

// Helper components
const Card = ({ title, value }) => (
  <div className="rounded-xl border bg-white p-4">
    <div className="text-xs font-medium text-gray-500">{title}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="grid place-items-center gap-2 p-6 text-center">
    <div className="text-base font-semibold">No complaints yet</div>
    <div className="text-sm text-gray-600">
      File the first complaint to get started.
    </div>
    <button
      onClick={onCreate}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
    >
      File a Complaint
    </button>
  </div>
);

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-lg">
      <div className="flex items-center border-b px-5 py-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={onClose}
          className="ml-auto rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export default Dashboard;

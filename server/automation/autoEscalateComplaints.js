import cron from "node-cron";
import { Complaint } from "../models/complaint.model.js";

/**
 * Automation job to auto-escalate SLA breached complaints.
 * Runs every 15 minutes.
 */
export const autoEscalateComplaints = () => {
  cron.schedule("*/300 * * * *", async () => {
    try {
      console.log("[AUTO-ESCALATE] Running SLA breach check...");

      const now = new Date();

      // 1. Find complaints with SLA deadline passed, not already escalated
      const complaints = await Complaint.find({
        "sla.dueAt": { $lte: now },
        "sla.breached": { $ne: true },
        "escalation.isEscalated": { $ne: true },
        status: { $in: ["pending", "in_progress"] },
      });

      if (!complaints.length) {
        console.log("[AUTO-ESCALATE] No SLA breaches found.");
        return;
      }

      console.log(
        `[AUTO-ESCALATE] Found ${complaints.length} SLA breached complaints.`
      );

      // 2. Escalate each complaint using model method
      for (const complaint of complaints) {
        await complaint.escalateSystem();
        console.log(`[AUTO-ESCALATE] Escalated complaint ID: ${complaint._id}`);
      }
    } catch (err) {
      console.error("[AUTO-ESCALATE] Error:", err.message);
    }
  });
};

import { getPNRStatus } from "@/lib/api/irctc";
import { getWaitlist, updateWaitlistStatus, removeFromWaitlist } from "@/lib/waitlist-store";
import { sendEmail, sendSMS } from "@/lib/notifications";

const statusPriority: Record<string, number> = { CAN: 0, WL: 1, RAC: 2, CNF: 3 };

function statusRank(status: string): number {
  for (const [key, val] of Object.entries(statusPriority)) {
    if (status.startsWith(key)) return val;
  }
  return 0;
}

export function getWaitlistPrediction(status: string): {
  label: string;
  probability: number;
  color: string;
} {
  if (status.startsWith("CNF")) return { label: "Confirmed", probability: 100, color: "text-success" };
  if (status.startsWith("RAC")) {
    const num = parseInt(status.replace("RAC", "")) || 1;
    const prob = Math.max(5, 90 - num * 15);
    return { label: `RAC ${num}`, probability: prob, color: "text-warning" };
  }
  if (status.startsWith("WL")) {
    const num = parseInt(status.replace("WL", "")) || 1;
    const prob = Math.max(1, 70 - num * 7);
    return { label: `WL ${num}`, probability: prob, color: num > 20 ? "text-error" : "text-tertiary" };
  }
  if (status === "CAN") return { label: "Cancelled", probability: 0, color: "text-muted-foreground" };
  return { label: status, probability: 50, color: "text-muted-foreground" };
}

export async function checkSinglePNR(pnr: string): Promise<{
  changed: boolean;
  oldStatus: string;
  newStatus: string;
}> {
  const list = getWaitlist();
  const entry = list.find((e) => e.pnr === pnr);
  if (!entry) return { changed: false, oldStatus: "", newStatus: "" };

  const oldStatus = entry.status;
  const result = await getPNRStatus(pnr);
  const newStatus = result?.current_status || result?.booking_status || oldStatus;

  updateWaitlistStatus(pnr, newStatus);

  const changed = oldStatus !== newStatus && statusRank(newStatus) > statusRank(oldStatus);
  return { changed, oldStatus, newStatus };
}

export async function checkAllWaitlisted(): Promise<number> {
  const list = getWaitlist().filter((e) => e.autoCheck);
  let changes = 0;

  for (const entry of list) {
    try {
      const { changed, newStatus } = await checkSinglePNR(entry.pnr);
      if (changed) {
        changes++;
        sendEmail(
          "user@railbookpro.local",
          `PNR ${entry.pnr} Status Updated — ${newStatus}`,
          `Your booking ${entry.trainName} (${entry.pnr}) status changed to ${newStatus}. Check your PNR for details.`
        );
        sendSMS(
          "",
          `RailBookPro: PNR ${entry.pnr} (${entry.trainName}) status updated to ${newStatus}.`
        );
      }
    } catch {
      /* skip failed checks */
    }
  }

  return changes;
}

export function getConfirmationTimeline(pnr: string): string[] {
  const list = getWaitlist();
  const entry = list.find((e) => e.pnr === pnr);
  if (!entry) return [];
  const timeline: string[] = [];
  if (entry.autoCheck) timeline.push("Auto-tracking enabled");
  timeline.push(`Last checked: ${new Date(entry.lastChecked).toLocaleString()}`);
  timeline.push(`Current status: ${entry.status}`);
  return timeline;
}

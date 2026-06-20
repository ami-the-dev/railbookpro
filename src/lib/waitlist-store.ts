export interface WaitlistEntry {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  status: string;
  lastChecked: string;
  autoCheck: boolean;
  notified: boolean;
}

const STORAGE_KEY = "railbookpro_waitlist";

export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addToWaitlist(entry: WaitlistEntry): void {
  if (typeof window === "undefined") return;
  const list = getWaitlist();
  if (list.some((e) => e.pnr === entry.pnr)) return;
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function removeFromWaitlist(pnr: string): void {
  if (typeof window === "undefined") return;
  const list = getWaitlist().filter((e) => e.pnr !== pnr);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function updateWaitlistStatus(pnr: string, status: string): void {
  if (typeof window === "undefined") return;
  const list = getWaitlist().map((e) =>
    e.pnr === pnr ? { ...e, status, lastChecked: new Date().toISOString() } : e
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function toggleAutoCheck(pnr: string, enabled: boolean): void {
  if (typeof window === "undefined") return;
  const list = getWaitlist().map((e) =>
    e.pnr === pnr ? { ...e, autoCheck: enabled } : e
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

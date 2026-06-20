export interface CommissionEntry {
  id: string;
  agentEmail: string;
  agentName: string;
  pnr: string;
  trainName: string;
  bookingFare: number;
  commissionPercent: number;
  commissionAmount: number;
  date: string;
  status: "pending" | "paid";
}

export interface AgentProfile {
  email: string;
  name: string;
  phone: string;
  commissionPercent: number;
  totalEarned: number;
  totalPaid: number;
  isActive: boolean;
}

const COMMISSION_KEY = "railbookpro_commissions";
const AGENTS_KEY = "railbookpro_agents";
const DEFAULT_COMMISSION = 2;

export function getAgents(): AgentProfile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(AGENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getAgent(email: string): AgentProfile | undefined {
  return getAgents().find((a) => a.email === email);
}

export function saveAgent(profile: AgentProfile): void {
  if (typeof window === "undefined") return;
  const list = getAgents().filter((a) => a.email !== profile.email);
  list.push(profile);
  localStorage.setItem(AGENTS_KEY, JSON.stringify(list));
}

export function getCommissions(): CommissionEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(COMMISSION_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getAgentCommissions(email: string): CommissionEntry[] {
  return getCommissions().filter((c) => c.agentEmail === email);
}

export function addCommission(entry: CommissionEntry): void {
  if (typeof window === "undefined") return;
  const list = getCommissions();
  list.push(entry);
  localStorage.setItem(COMMISSION_KEY, JSON.stringify(list));
  const agent = getAgent(entry.agentEmail);
  if (agent) {
    agent.totalEarned += entry.commissionAmount;
    saveAgent(agent);
  }
}

export function markCommissionPaid(id: string): void {
  if (typeof window === "undefined") return;
  const list = getCommissions().map((c) =>
    c.id === id ? { ...c, status: "paid" as const } : c
  );
  localStorage.setItem(COMMISSION_KEY, JSON.stringify(list));
  const entry = list.find((c) => c.id === id);
  if (entry) {
    const agent = getAgent(entry.agentEmail);
    if (agent) {
      agent.totalPaid += entry.commissionAmount;
      saveAgent(agent);
    }
  }
}

export function calculateCommission(fare: number, percent: number): number {
  return Math.round(fare * percent) / 100;
}

export function generateCommissionId(): string {
  return "comm_" + Math.random().toString(36).substring(2, 10);
}

export function registerAgent(email: string, name: string, phone: string): AgentProfile {
  const profile: AgentProfile = {
    email,
    name,
    phone,
    commissionPercent: DEFAULT_COMMISSION,
    totalEarned: 0,
    totalPaid: 0,
    isActive: true,
  };
  saveAgent(profile);
  return profile;
}

export type UserRole = "user" | "agent" | "distributor";
export type Gender = "male" | "female" | "transgender" | "";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "";
export type IdType = "" | "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  nationality: string;
  occupation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  idType: IdType;
  idNumber: string;
  securityQuestion: string;
  securityAnswer: string;
}

const users = new Map<string, StoredUser>();

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function defaultProfile() {
  return {
    dateOfBirth: "", gender: "" as Gender, maritalStatus: "" as MaritalStatus,
    nationality: "Indian", occupation: "", address: "", city: "", state: "", pincode: "",
    country: "India", idType: "" as IdType, idNumber: "",
    securityQuestion: "", securityAnswer: "",
  };
}

// Seed default test users so they survive hot reloads
const testUsers: StoredUser[] = [
  { id: generateId(), name: "Test User", email: "test@example.com", phone: "9999999999", password: "password123", role: "user", ...defaultProfile() },
  { id: generateId(), name: "Test Agent", email: "agent@example.com", phone: "8888888888", password: "password123", role: "agent", ...defaultProfile() },
];
for (const u of testUsers) {
  users.set(u.id, u);
}

export function createUser(name: string, email: string, phone: string, password: string, role: UserRole = "user"): StoredUser | null {
  const existing = Array.from(users.values()).find(u => u.email === email || u.phone === phone);
  if (existing) return null;
  const user: StoredUser = { id: generateId(), name, email, phone, password, role, ...defaultProfile() };
  users.set(user.id, user);
  return user;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return Array.from(users.values()).find(u => u.email === email);
}

export function findUserById(id: string): StoredUser | undefined {
  return users.get(id);
}

export function getAllUsers(): StoredUser[] {
  return Array.from(users.values());
}

export function getUsersByRole(role: UserRole): StoredUser[] {
  return Array.from(users.values()).filter(u => u.role === role);
}

export function updateUserRole(id: string, role: UserRole): StoredUser | null {
  const user = users.get(id);
  if (!user) return null;
  user.role = role;
  return user;
}

export function updateUser(id: string, data: Partial<StoredUser>): StoredUser | null {
  const user = users.get(id);
  if (!user) return null;
  const allowed = ["name", "phone", "dateOfBirth", "gender", "maritalStatus", "nationality", "occupation", "address", "city", "state", "pincode", "country", "idType", "idNumber", "securityQuestion", "securityAnswer"] as const;
  for (const key of allowed) {
    if ((data as any)[key] !== undefined) (user as any)[key] = (data as any)[key];
  }
  return user;
}

export function updateUserPassword(id: string, newPassword: string): StoredUser | null {
  const user = users.get(id);
  if (!user) return null;
  user.password = newPassword;
  return user;
}

const resetTokens = new Map<string, { userId: string; expires: Date }>();

export function createResetToken(email: string): string | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  resetTokens.set(token, { userId: user.id, expires: new Date(Date.now() + 60 * 60 * 1000) });
  return token;
}

export function findUserByResetToken(token: string): StoredUser | null {
  const entry = resetTokens.get(token);
  if (!entry || entry.expires < new Date()) {
    resetTokens.delete(token);
    return null;
  }
  return findUserById(entry.userId) || null;
}

export function consumeResetToken(token: string): boolean {
  return resetTokens.delete(token);
}

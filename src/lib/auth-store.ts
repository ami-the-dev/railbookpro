export type UserRole = "user" | "agent" | "distributor";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

const users = new Map<string, StoredUser>();

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function createUser(name: string, email: string, phone: string, password: string, role: UserRole = "user"): StoredUser | null {
  const existing = Array.from(users.values()).find(u => u.email === email || u.phone === phone);
  if (existing) return null;
  const user: StoredUser = { id: generateId(), name, email, phone, password, role };
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

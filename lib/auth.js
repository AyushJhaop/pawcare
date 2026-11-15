// Illustrative Demo Authentication & Role-Based Access Control (RBAC) Layer
// NOTE: This is a localStorage-backed demonstration authentication prototype
// designed for the PawCare MVP assignment. In production, replace with a
// server-verified session provider (e.g., NextAuth/Auth.js, Clerk, or Supabase Auth).

import { addSubmittedBusiness } from "@/lib/storage";

const SESSION_KEY = "pawcare_demo_auth_session_v1";
const USERS_KEY = "pawcare_demo_auth_users_v1";

export const ROLES = {
  PET_PARENT: "pet_parent",
  SERVICE_PROVIDER: "service_provider",
  ADMIN: "admin",
};

export const DEMO_ACCOUNTS = [
  {
    id: "user-pet-parent-1",
    name: "Maya Lin",
    email: "maya@demo.pawcare",
    password: "PawCare123!",
    role: ROLES.PET_PARENT,
    phone: "+1-555-010-4411",
    city: "New York, NY",
    petName: "Cooper (Dalmatian) & Mochi (Scottish Fold)",
    petSpecies: "Dog & Cat",
    bio: "Pet parent in SoHo looking for fear-free veterinary clinics and weekend boarding.",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "user-provider-1",
    name: "Dr. Elena Rostova",
    email: "dr.elena@demo.pawcare",
    password: "PawCare123!",
    role: ROLES.SERVICE_PROVIDER,
    phone: "+1-555-019-2831",
    city: "New York, NY",
    businessName: "Atelier Veterinary House",
    linkedProviderId: "prov-1",
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "user-admin-1",
    name: "PawCare Trust & Safety Admin",
    email: "admin@demo.pawcare",
    password: "AdminPaw123!",
    role: ROLES.ADMIN,
    phone: "+1-555-010-0001",
    city: "New York, NY",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
];

function getStoredUsers() {
  if (typeof window === "undefined") return DEMO_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
      return DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    // Ensure default demo accounts are always present
    const emails = new Set(parsed.map((u) => u.email.toLowerCase()));
    const merged = [...parsed];
    for (const demo of DEMO_ACCOUNTS) {
      if (!emails.has(demo.email.toLowerCase())) {
        merged.push(demo);
      }
    }
    return merged;
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function saveUsers(users) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentSession(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
  } else {
    const safeUser = { ...user };
    delete safeUser.password;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  }
  window.dispatchEvent(new CustomEvent("pawcare-auth-updated"));
}

export function loginWithCredentials(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const users = getStoredUsers();
  const matched = users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail &&
      u.password === String(password || "")
  );

  if (!matched) {
    return {
      ok: false,
      error:
        "Invalid email or password. Try one of the quick Demo Accounts below or check your credentials.",
    };
  }

  setCurrentSession(matched);
  return {
    ok: true,
    user: matched,
    redirectTo: getDashboardRouteForRole(matched.role),
  };
}

export function registerAccount({
  name,
  email,
  password,
  role,
  businessName,
  category,
  phone,
  address,
  city,
  services,
  description,
  petName,
}) {
  // Enforce security rule: Admin accounts can NEVER be created via public registration
  const assignedRole =
    role === ROLES.SERVICE_PROVIDER
      ? ROLES.SERVICE_PROVIDER
      : ROLES.PET_PARENT;

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const users = getStoredUsers();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return {
      ok: false,
      error:
        "An account with this email address already exists. Please sign in instead.",
    };
  }

  let linkedProviderId = null;

  // If registering as a Service Provider, create their initial Pending Verification listing
  if (assignedRole === ROLES.SERVICE_PROVIDER) {
    const createdProvider = addSubmittedBusiness({
      businessName: businessName || `${name}'s Animal Care Practice`,
      category: category || "Veterinary Clinics",
      contactPerson: name,
      email: normalizedEmail,
      phone: phone || "+1-555-019-0000",
      address: address || "100 Main Street",
      city: city || "New York, NY",
      services:
        services || "General Veterinary Consultations, Preventive Wellness",
      description:
        description ||
        "Compassionate animal-care provider registered via PawCare.",
      ownerEmail: normalizedEmail,
    });
    linkedProviderId = createdProvider.id;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: String(name || "").trim(),
    email: normalizedEmail,
    password: String(password || ""),
    role: assignedRole,
    phone: phone || "+1-555-010-1234",
    city: city || "New York, NY",
    petName: petName || "Buddy (Golden Retriever)",
    businessName:
      assignedRole === ROLES.SERVICE_PROVIDER
        ? businessName || `${name}'s Animal Care Practice`
        : undefined,
    linkedProviderId,
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);
  setCurrentSession(newUser);

  return {
    ok: true,
    user: newUser,
    redirectTo: getDashboardRouteForRole(assignedRole),
  };
}

export function updateCurrentUserProfile(updates) {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getStoredUsers();
  const nextUsers = users.map((u) =>
    u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase()
      ? { ...u, ...updates }
      : u
  );
  saveUsers(nextUsers);

  const updatedSession = { ...current, ...updates };
  setCurrentSession(updatedSession);
  return updatedSession;
}

export function logoutUser() {
  setCurrentSession(null);
}

export function getDashboardRouteForRole(role) {
  if (role === ROLES.ADMIN) return "/dashboard/admin";
  if (role === ROLES.SERVICE_PROVIDER) return "/dashboard/provider";
  return "/dashboard/pet-parent";
}

export function getRoleDisplayLabel(role) {
  if (role === ROLES.ADMIN) return "Platform Admin";
  if (role === ROLES.SERVICE_PROVIDER) return "Service Provider";
  return "Pet Parent";
}


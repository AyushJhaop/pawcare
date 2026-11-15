// Client-side localStorage persistence layer for PawCare MVP Prototype
import { INITIAL_PROVIDERS } from "@/data/providers";

const SAVED_KEY = "pawcare_saved_providers_v1";
const SUBMISSIONS_KEY = "pawcare_submitted_businesses_v1";
const CORRECTIONS_KEY = "pawcare_correction_requests_v1";
const OVERRIDES_KEY = "pawcare_provider_overrides_v1";

const DEFAULT_CORRECTIONS = [
  {
    id: "corr-demo-1",
    providerName: "Kindred Paws Holistic & Integrative Clinic",
    issueType: "Incorrect opening hours",
    description:
      "Clinic recently added Thursday evening hours until 8:00 PM for working pet parents.",
    correctInfo: "Tue–Sat: 9:00 AM – 6:00 PM (Thu until 8:00 PM)",
    contactEmail: "maya@demo.pawcare",
    status: "Pending Review",
    createdAt: "2026-11-12T14:20:00.000Z",
    isDemoSeed: true,
  },
  {
    id: "corr-demo-2",
    providerName: "Second Chance Paws Foundation & Clinic",
    issueType: "Incorrect service information",
    description:
      "They now also offer weekend microchipping walk-in clinics for community cats and dogs.",
    correctInfo: "Add 'Weekend Walk-In Microchipping' to services list",
    contactEmail: "volunteer@demo.pawcare",
    status: "Pending Review",
    createdAt: "2026-11-13T09:45:00.000Z",
    isDemoSeed: true,
  },
];

function safeReadJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("pawcare-storage-updated"));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_IMAGE_MAP = {
  "Veterinary Clinics": "/images/card-vet-clinic.jpg",
  "Animal Hospitals": "/images/card-pet-hospital.jpg",
  "Pet Boarding": "/images/card-grooming.jpg",
  "Diagnostics & Labs": "/images/card-diagnostics.jpg",
  "Veterinary Ambulances": "/images/card-ambulance.jpg",
  "Animal NGOs & Rescues": "/images/card-preventive.jpg",
};

export function getSavedProviderIds() {
  return safeReadJson(SAVED_KEY, ["prov-1", "prov-2"]);
}

export function isProviderSaved(providerId) {
  const ids = getSavedProviderIds();
  return ids.includes(providerId);
}

export function toggleSavedProvider(providerId) {
  const ids = getSavedProviderIds();
  const exists = ids.includes(providerId);
  const next = exists
    ? ids.filter((id) => id !== providerId)
    : [...ids, providerId];
  safeWriteJson(SAVED_KEY, next);
  return { saved: !exists, savedIds: next };
}

export function removeSavedProvider(providerId) {
  const ids = getSavedProviderIds();
  const next = ids.filter((id) => id !== providerId);
  safeWriteJson(SAVED_KEY, next);
  return next;
}

export function getSubmittedBusinesses() {
  return safeReadJson(SUBMISSIONS_KEY, []);
}

export function addSubmittedBusiness(formData) {
  const submissions = getSubmittedBusinesses();
  const id = `user-prov-${Date.now()}`;
  const baseSlug = slugify(formData.businessName) || `provider-${Date.now()}`;
  const servicesList = Array.isArray(formData.services)
    ? formData.services
    : String(formData.services || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const newProvider = {
    id,
    name: formData.businessName.trim(),
    slug: `${baseSlug}-${id.slice(-4)}`,
    category: formData.category || "Veterinary Clinics",
    contactPerson: formData.contactPerson?.trim() || "Clinic Representative",
    description: formData.description.trim(),
    about: formData.description.trim(),
    image:
      CATEGORY_IMAGE_MAP[formData.category] || "/images/card-vet-clinic.jpg",
    address: formData.address.trim(),
    city: formData.city.trim(),
    area: formData.city.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim(),
    website: formData.website?.trim() || "",
    rating: 4.8,
    reviewCount: 1,
    services:
      servicesList.length > 0
        ? servicesList
        : ["General Consultation", "Animal Care Support"],
    openingHours:
      formData.openingHours?.trim() || "Mon–Sat: 9:00 AM – 6:00 PM (Submitted)",
    isOpen: true,
    emergencyAvailable:
      formData.category === "Animal Hospitals" ||
      formData.category === "Veterinary Ambulances" ||
      Boolean(formData.emergencyAvailable),
    // Mandatory rule: Newly submitted listings ALWAYS start as Pending Verification
    verificationStatus: "Pending Verification",
    featured: false,
    isUserSubmitted: true,
    ownerEmail: formData.ownerEmail || formData.email.trim().toLowerCase(),
    submittedAt: new Date().toISOString(),
    sampleReviews: [],
  };

  const next = [newProvider, ...submissions];
  safeWriteJson(SUBMISSIONS_KEY, next);
  return newProvider;
}

export function updateProviderListing(providerId, updates) {
  // Check if it's in user-submitted businesses first
  const submissions = getSubmittedBusinesses();
  const subIdx = submissions.findIndex((p) => p.id === providerId);
  if (subIdx !== -1) {
    const updated = { ...submissions[subIdx], ...updates };
    const next = [...submissions];
    next[subIdx] = updated;
    safeWriteJson(SUBMISSIONS_KEY, next);
    return updated;
  }

  // Otherwise store in overrides map
  const overrides = getProviderOverrides();
  const currentOverride = overrides[providerId] || {};
  const nextOverrides = {
    ...overrides,
    [providerId]: {
      ...currentOverride,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  };
  safeWriteJson(OVERRIDES_KEY, nextOverrides);
  return nextOverrides[providerId];
}

export function getProviderOverrides() {
  return safeReadJson(OVERRIDES_KEY, {});
}

export function setProviderVerificationStatus(providerId, status) {
  return updateProviderListing(providerId, { verificationStatus: status });
}

export function getAllProviders() {
  const submissions = getSubmittedBusinesses();
  const overrides = getProviderOverrides();

  const mergedInitial = INITIAL_PROVIDERS.map((prov) => {
    const ov = overrides[prov.id];
    return ov ? { ...prov, ...ov } : prov;
  });

  const mergedSubmissions = submissions.map((prov) => {
    const ov = overrides[prov.id];
    return ov ? { ...prov, ...ov } : prov;
  });

  // Hide rejected listings from public discovery unless includeRejected is requested
  return [...mergedSubmissions, ...mergedInitial];
}

export function getProviderBySlug(slug) {
  const all = getAllProviders();
  return all.find((p) => p.slug === slug) || null;
}

export function getCorrectionRequests() {
  const stored = safeReadJson(CORRECTIONS_KEY, null);
  if (!stored) {
    return DEFAULT_CORRECTIONS;
  }
  return stored;
}

export function addCorrectionRequest(data) {
  const existing = getCorrectionRequests();
  const entry = {
    id: `corr-${Date.now()}`,
    providerName: data.providerName.trim(),
    issueType: data.issueType,
    description: data.description.trim(),
    correctInfo: data.correctInfo?.trim() || "",
    contactEmail: data.contactEmail?.trim() || "",
    // Mandatory rule: Corrections start as "Pending Review"
    status: "Pending Review",
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...existing];
  safeWriteJson(CORRECTIONS_KEY, next);
  return entry;
}

export function updateCorrectionStatus(correctionId, newStatus) {
  const existing = getCorrectionRequests();
  const next = existing.map((item) =>
    item.id === correctionId ? { ...item, status: newStatus } : item
  );
  safeWriteJson(CORRECTIONS_KEY, next);
  return next;
}


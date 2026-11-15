// Search, filter, geolocation distance, and sorting utilities for PawCare MVP

export function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number"
  ) {
    return null;
  }
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function filterAndSortProviders(providers, filters = {}) {
  const {
    query = "",
    location = "",
    category = "All",
    openNow = false,
    emergencyOnly = false,
    minRating = 0,
    sortBy = "relevance",
    userCoords = null,
    includeRejected = false,
  } = filters;

  const q = String(query || "").trim().toLowerCase();
  const loc = String(location || "").trim().toLowerCase();

  const filtered = providers
    .filter((provider) => {
      if (!includeRejected && provider.verificationStatus === "Rejected") {
        return false;
      }

      // Category filter
      if (category && category !== "All" && provider.category !== category) {
        return false;
      }

      // Open now filter
      if (openNow && !provider.isOpen) {
        return false;
      }

      // Emergency services filter
      if (emergencyOnly && !provider.emergencyAvailable) {
        return false;
      }

      // Minimum rating filter
      if (minRating > 0 && Number(provider.rating || 0) < Number(minRating)) {
        return false;
      }

      // Location text match
      if (loc) {
        const locationHaystack = [
          provider.address,
          provider.city,
          provider.area,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!locationHaystack.includes(loc)) {
          return false;
        }
      }

      // Keyword / service / provider name search
      if (q) {
        const keywordHaystack = [
          provider.name,
          provider.category,
          provider.description,
          provider.about,
          provider.address,
          provider.city,
          provider.area,
          ...(provider.services || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!keywordHaystack.includes(q)) {
          return false;
        }
      }

      return true;
    })
    .map((provider) => {
      const distanceMiles =
        userCoords && provider.latitude && provider.longitude
          ? calculateDistanceMiles(
              userCoords.latitude,
              userCoords.longitude,
              provider.latitude,
              provider.longitude
            )
          : null;
      return {
        ...provider,
        distanceMiles,
      };
    });

  // Sort results
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    }
    if (sortBy === "reviews") {
      return b.reviewCount - a.reviewCount;
    }
    if (sortBy === "distance" && userCoords) {
      const da = a.distanceMiles ?? 9999;
      const db = b.distanceMiles ?? 9999;
      return da - db;
    }
    // Default "relevance": Featured & Verified first, then rating
    const scoreA =
      (a.featured ? 20 : 0) +
      (a.verificationStatus === "Verified" ? 10 : 0) +
      a.rating;
    const scoreB =
      (b.featured ? 20 : 0) +
      (b.verificationStatus === "Verified" ? 10 : 0) +
      b.rating;
    return scoreB - scoreA;
  });

  return sorted;
}

export function getGoogleMapsDirectionsUrl(provider) {
  const destination = encodeURIComponent(
    `${provider.name}, ${provider.address}, ${provider.city || ""}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${destination}`;
}


/**
 * Utility functions for listing-related operations
 */

import type { AdminListing } from "@/types/admin";

/**
 * Electronics-specific specifications for mock data
 */
export interface ElectronicsSpecifications {
  brand?: string;
  model?: string;
  storage?: string;
  batteryHealth?: string;
}

/**
 * Key feature pair for display
 */
export interface KeyFeature {
  label: string;
  value: string;
}

/**
 * Get product specifications including mock electronics data
 */
export function getProductSpecifications(listing: AdminListing): KeyFeature[] {
  const mockData = getMockElectronicsData(listing.category);

  return [
    { label: "Category", value: listing.category },
    { label: "Brand", value: mockData.brand || "N/A" },
    { label: "Model", value: mockData.model || listing.name },
    { label: "Storage", value: mockData.storage || "N/A" },
    {
      label: "Battery Health",
      value: mockData.batteryHealth || "N/A",
    },
    {
      label: "Condition",
      value:
        listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1),
    },
  ];
}

/**
 * Generate mock electronics data based on category
 */
export function getMockElectronicsData(
  category: string,
): ElectronicsSpecifications {
  // Mock data based on category
  const categoryMap: Record<string, ElectronicsSpecifications> = {
    Phones: {
      brand: "Apple",
      model: "iPhone 11 Pro",
      storage: "256 GB",
      batteryHealth: "85%",
    },
    Laptops: {
      brand: "Dell",
      model: "XPS 15",
      storage: "512 GB SSD",
      batteryHealth: "92%",
    },
    Tablets: {
      brand: "Samsung",
      model: "Galaxy Tab S8",
      storage: "128 GB",
      batteryHealth: "88%",
    },
    Accessories: {
      brand: "Apple",
      model: "AirPods Pro",
      storage: "N/A",
      batteryHealth: "N/A",
    },
  };

  return (
    categoryMap[category] || {
      brand: "Generic",
      model: "Unknown",
      storage: "N/A",
      batteryHealth: "N/A",
    }
  );
}

/**
 * Parse location string to coordinates
 * Returns mock coordinates based on location name
 */
export function parseLocationToCoordinates(location?: string): {
  lat: number;
  lng: number;
} {
  if (!location) {
    // Default to Gaza, Palestine
    return { lat: 31.5017, lng: 34.4668 };
  }

  // Mock coordinate mapping for common locations
  const locationMap: Record<string, { lat: number; lng: number }> = {
    Gaza: { lat: 31.5017, lng: 34.4668 },
    Palestine: { lat: 31.5017, lng: 34.4668 },
    "Gaza, Palestine": { lat: 31.5017, lng: 34.4668 },
    Ramallah: { lat: 31.9, lng: 35.2 },
    Jerusalem: { lat: 31.7683, lng: 35.2137 },
    Hebron: { lat: 31.5326, lng: 35.0998 },
    Nablus: { lat: 32.2211, lng: 35.2544 },
  };

  // Try exact match first
  const exactMatch = locationMap[location];
  if (exactMatch) return exactMatch;

  // Try partial match
  const partialKey = Object.keys(locationMap).find((key) =>
    location.toLowerCase().includes(key.toLowerCase()),
  );
  if (partialKey) return locationMap[partialKey];

  // Default fallback
  return { lat: 31.5017, lng: 34.4668 };
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const created = new Date(dateString).getTime();
  const now = Date.now();
  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

/**
 * Format reason text (replace underscores, capitalize words)
 */
export function formatReason(reason?: string): string {
  if (!reason) return "Not provided";
  return reason
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

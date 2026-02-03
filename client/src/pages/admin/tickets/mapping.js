// mapping.js

// Display mapping for status
export const STATUS_MAP = {
  open: "Open",
  "in progress": "In Progress",
  "in-progress": "In Progress",
  "on hold": "On Hold",
  resolved: "Resolved",
  closed: "Closed",
};

// Display mapping for priority
export const PRIORITY_MAP = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
  emergency: "Emergency",
};

// Display mapping for category
export const CATEGORY_MAP = {
  hardware: "Hardware",
  software: "Software",
  network: "Network",
  other: "Other",
};

// Badge colors for status
export const STATUS_COLOR = {
  open: "bg-blue-100 text-blue-700",
  "in progress": "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  "on hold": "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

// Badge colors for priority
export const PRIORITY_COLOR = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-200 text-red-800",
  emergency: "bg-red-500 text-white",
};

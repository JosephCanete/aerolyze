// Strava API Configuration
export const STRAVA_API_BASE_URL = "https://www.strava.com/api/v3";

export const STRAVA_ENDPOINTS = {
  ACTIVITIES: "/athlete/activities",
  ACTIVITY_DETAIL: (id: string) => `/activities/${id}`,
  ACTIVITY_PHOTOS: (id: string) => `/activities/${id}/photos`,
  ATHLETE: "/athlete",
} as const;

// Activity Types
export const ACTIVITY_TYPES = {
  AlpineSki: "Alpine Ski",
  BackcountrySki: "Backcountry Ski",
  Badminton: "Badminton",
  Canoeing: "Canoeing",
  Crossfit: "Crossfit",
  EBikeRide: "E-Bike Ride",
  Elliptical: "Elliptical",
  EMountainBikeRide: "E-Mountain Bike Ride",
  Golf: "Golf",
  GravelRide: "Gravel Ride",
  Handcycle: "Handcycle",
  HighIntensityIntervalTraining: "HIIT",
  Hike: "Hike",
  IceSkate: "Ice Skate",
  InlineSkate: "Inline Skate",
  Kayaking: "Kayaking",
  Kitesurf: "Kitesurf",
  MountainBikeRide: "Mountain Bike Ride",
  NordicSki: "Nordic Ski",
  Pickleball: "Pickleball",
  Pilates: "Pilates",
  Racquetball: "Racquetball",
  Ride: "Ride",
  RockClimbing: "Rock Climbing",
  RollerSki: "Roller Ski",
  Rowing: "Rowing",
  Run: "Run",
  Sail: "Sail",
  Skateboard: "Skateboard",
  Snowboard: "Snowboard",
  Snowshoe: "Snowshoe",
  Soccer: "Soccer",
  Squash: "Squash",
  StairStepper: "Stair Stepper",
  StandUpPaddling: "Stand Up Paddling",
  Surfing: "Surfing",
  Swim: "Swim",
  TableTennis: "Table Tennis",
  Tennis: "Tennis",
  TrailRun: "Trail Run",
  Velomobile: "Velomobile",
  VirtualRide: "Virtual Ride",
  VirtualRow: "Virtual Row",
  VirtualRun: "Virtual Run",
  Walk: "Walk",
  WeightTraining: "Weight Training",
  Wheelchair: "Wheelchair",
  Windsurf: "Windsurf",
  Workout: "Workout",
  Yoga: "Yoga",
} as const;

// UI Constants
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const COLORS = {
  STRAVA_ORANGE: "#FC4C02",
  PRIMARY: "#1f2937",
  SECONDARY: "#6b7280",
  SUCCESS: "#10b981",
  ERROR: "#ef4444",
  WARNING: "#f59e0b",
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 200;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  ACTIVITIES: 300, // 5 minutes
  ACTIVITY_DETAIL: 900, // 15 minutes
  PHOTOS: 1800, // 30 minutes
} as const;

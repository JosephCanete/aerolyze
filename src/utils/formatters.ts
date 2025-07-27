/**
 * Format distance from meters to a human-readable string
 */
export function formatDistance(distanceInMeters: number): string {
  const distanceInKm = distanceInMeters / 1000;

  if (distanceInKm < 1) {
    return `${Math.round(distanceInMeters)}m`;
  }

  return `${distanceInKm.toFixed(1)}km`;
}

/**
 * Format time from seconds to a human-readable string
 */
export function formatTime(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

/**
 * Format elevation gain to a human-readable string
 */
export function formatElevation(elevationInMeters: number): string {
  return `${Math.round(elevationInMeters)}m`;
}

/**
 * Format speed from m/s to km/h
 */
export function formatSpeed(speedInMps: number): string {
  const speedInKmh = speedInMps * 3.6;
  return `${speedInKmh.toFixed(1)} km/h`;
}

/**
 * Format pace from m/s to min/km
 */
export function formatPace(speedInMps: number): string {
  if (speedInMps === 0) return "0:00 /km";

  const paceInMinPerKm = 1000 / (speedInMps * 60);
  const minutes = Math.floor(paceInMinPerKm);
  const seconds = Math.round((paceInMinPerKm - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

/**
 * Format power to a human-readable string
 */
export function formatPower(powerInWatts: number): string {
  return `${Math.round(powerInWatts)}W`;
}

/**
 * Format heart rate to a human-readable string
 */
export function formatHeartRate(bpm: number): string {
  return `${Math.round(bpm)} bpm`;
}

/**
 * Format cadence to a human-readable string
 */
export function formatCadence(rpm: number): string {
  return `${Math.round(rpm)} rpm`;
}

/**
 * Get activity emoji based on activity type
 */
export function getActivityEmoji(activityType: string): string {
  const emojiMap: Record<string, string> = {
    Run: "🏃",
    TrailRun: "🏃‍♂️",
    Ride: "🚴",
    MountainBikeRide: "🚵",
    GravelRide: "🚴‍♀️",
    EBikeRide: "🚴‍♂️",
    EMountainBikeRide: "🚵‍♀️",
    VirtualRide: "🚴‍♂️",
    Swim: "🏊",
    Hike: "🥾",
    Walk: "🚶",
    AlpineSki: "⛷️",
    BackcountrySki: "🎿",
    NordicSki: "🎿",
    Snowboard: "🏂",
    IceSkate: "⛸️",
    InlineSkate: "🛼",
    RockClimbing: "🧗",
    Surfing: "🏄",
    Windsurf: "🏄‍♂️",
    Kitesurf: "🪁",
    StandUpPaddling: "🏄‍♀️",
    Kayaking: "🛶",
    Canoeing: "🛶",
    Rowing: "🚣",
    Sail: "⛵",
    Golf: "⛳",
    Tennis: "🎾",
    Badminton: "🏸",
    TableTennis: "🏓",
    Squash: "🎾",
    Soccer: "⚽",
    WeightTraining: "🏋️",
    Crossfit: "🏋️‍♀️",
    Yoga: "🧘",
    Pilates: "🧘‍♀️",
    Workout: "💪",
    Elliptical: "🏃‍♀️",
    StairStepper: "🪜",
  };

  return emojiMap[activityType] || "🏃";
}

/**
 * Calculate activity intensity based on average heart rate
 */
export function getActivityIntensity(
  avgHeartRate?: number,
  maxHeartRate?: number
): string {
  if (!avgHeartRate || !maxHeartRate) return "Unknown";

  const percentage = (avgHeartRate / maxHeartRate) * 100;

  if (percentage < 60) return "Easy";
  if (percentage < 70) return "Moderate";
  if (percentage < 80) return "Hard";
  if (percentage < 90) return "Very Hard";
  return "Maximum";
}

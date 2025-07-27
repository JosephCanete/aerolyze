import { describe, it, expect } from "vitest";
import {
  formatDistance,
  formatTime,
  formatElevation,
  formatSpeed,
  formatPace,
  formatPower,
  formatHeartRate,
  formatCadence,
  getActivityEmoji,
  getActivityIntensity,
} from "@/utils/formatters";

describe("Formatter Utilities", () => {
  describe("formatDistance", () => {
    it("formats meters to kilometers correctly", () => {
      expect(formatDistance(1000)).toBe("1.0km");
      expect(formatDistance(5432)).toBe("5.4km");
      expect(formatDistance(12345)).toBe("12.3km");
    });

    it("formats small distances in meters", () => {
      expect(formatDistance(500)).toBe("500m");
      expect(formatDistance(999)).toBe("999m");
      expect(formatDistance(0)).toBe("0m");
    });
  });

  describe("formatTime", () => {
    it("formats seconds to human-readable time", () => {
      expect(formatTime(30)).toBe("30s");
      expect(formatTime(90)).toBe("1m 30s");
      expect(formatTime(3661)).toBe("1h 1m 1s");
      expect(formatTime(7325)).toBe("2h 2m 5s");
    });

    it("handles edge cases", () => {
      expect(formatTime(0)).toBe("0s");
      expect(formatTime(3600)).toBe("1h 0m 0s");
      expect(formatTime(60)).toBe("1m 0s");
    });
  });

  describe("formatElevation", () => {
    it("formats elevation gain in meters", () => {
      expect(formatElevation(123.456)).toBe("123m");
      expect(formatElevation(0)).toBe("0m");
      expect(formatElevation(1500.7)).toBe("1501m");
    });
  });

  describe("formatSpeed", () => {
    it("converts m/s to km/h", () => {
      expect(formatSpeed(2.78)).toBe("10.0 km/h"); // ~10 km/h
      expect(formatSpeed(0)).toBe("0.0 km/h");
      expect(formatSpeed(5.56)).toBe("20.0 km/h"); // ~20 km/h
    });
  });

  describe("formatPower", () => {
    it("formats power in watts", () => {
      expect(formatPower(250.7)).toBe("251W");
      expect(formatPower(0)).toBe("0W");
      expect(formatPower(450.2)).toBe("450W");
    });
  });

  describe("formatHeartRate", () => {
    it("formats heart rate in bpm", () => {
      expect(formatHeartRate(150.5)).toBe("151 bpm");
      expect(formatHeartRate(0)).toBe("0 bpm");
      expect(formatHeartRate(180.2)).toBe("180 bpm");
    });
  });

  describe("formatCadence", () => {
    it("formats cadence in rpm", () => {
      expect(formatCadence(85.7)).toBe("86 rpm");
      expect(formatCadence(0)).toBe("0 rpm");
      expect(formatCadence(95.2)).toBe("95 rpm");
    });
  });

  describe("getActivityEmoji", () => {
    it("returns correct emojis for activity types", () => {
      expect(getActivityEmoji("Run")).toBe("🏃");
      expect(getActivityEmoji("Ride")).toBe("🚴");
      expect(getActivityEmoji("Swim")).toBe("🏊");
      expect(getActivityEmoji("Hike")).toBe("🥾");
      expect(getActivityEmoji("UnknownActivity")).toBe("🏃"); // default
    });
  });
});

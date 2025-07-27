import { describe, it, expect, beforeEach, vi } from "vitest";
import { StravaApiService } from "@/services/stravaApi";

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = fetch as any;

describe("StravaApiService", () => {
  let service: StravaApiService;
  const mockAccessToken = "test-access-token";

  beforeEach(() => {
    service = new StravaApiService();
    mockFetch.mockClear();
  });

  describe("getActivities", () => {
    it("fetches activities successfully", async () => {
      const mockActivities = [
        { id: 1, name: "Morning Run", distance: 5000 },
        { id: 2, name: "Evening Ride", distance: 15000 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities,
      } as Response);

      const result = await service.getActivities(mockAccessToken, 1, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.strava.com/api/v3/athlete/activities?page=1&per_page=10",
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      expect(result).toEqual(mockActivities);
    });

    it("handles API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ message: "Invalid token" }),
      } as Response);

      await expect(service.getActivities(mockAccessToken)).rejects.toThrow(
        "Invalid token"
      );
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(service.getActivities(mockAccessToken)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getActivityDetail", () => {
    it("fetches activity detail successfully", async () => {
      const mockActivity = {
        id: 123,
        name: "Test Activity",
        distance: 5000,
        moving_time: 1800,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivity,
      } as Response);

      const result = await service.getActivityDetail("123", mockAccessToken);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.strava.com/api/v3/activities/123",
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      expect(result).toEqual(mockActivity);
    });
  });

  describe("withRetry", () => {
    it("retries failed operations", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce("success");

      const result = await service.withRetry(operation, 3, 10);

      expect(operation).toHaveBeenCalledTimes(3);
      expect(result).toBe("success");
    });

    it("does not retry 4xx errors", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error("HTTP 401: Unauthorized"));

      await expect(service.withRetry(operation, 3, 10)).rejects.toThrow(
        "HTTP 401: Unauthorized"
      );
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("throws last error after max retries", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new Error("Persistent error"));

      await expect(service.withRetry(operation, 2, 10)).rejects.toThrow(
        "Persistent error"
      );
      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });
});

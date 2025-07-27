import { STRAVA_API_BASE_URL, STRAVA_ENDPOINTS } from "@/constants";
import type { StravaActivity, StravaPhoto, ApiError } from "@/types";

/**
 * Base API service for making HTTP requests to Strava API
 */
class ApiService {
  private baseUrl: string;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = parseInt(
    process.env.STRAVA_API_MIN_INTERVAL || "100"
  );

  constructor(baseUrl: string = STRAVA_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Rate limiting helper
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.debug(`[Rate Limit] Waiting ${waitTime}ms before next API call`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, accessToken: string): Promise<T> {
    await this.waitForRateLimit();

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Make a POST request to the API
   */
  async post<T, D = unknown>(
    endpoint: string,
    data: D,
    accessToken: string
  ): Promise<T> {
    await this.waitForRateLimit();

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Handle rate limiting and retries
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes("HTTP 4")) {
          throw error;
        }

        if (i === maxRetries) break;

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }

    throw lastError!;
  }
}

/**
 * Strava-specific API service
 */
export class StravaApiService extends ApiService {
  /**
   * Get athlete's activities
   */
  async getActivities(
    accessToken: string,
    page: number = 1,
    perPage: number = 30
  ): Promise<StravaActivity[]> {
    const endpoint = `${STRAVA_ENDPOINTS.ACTIVITIES}?page=${page}&per_page=${perPage}`;

    return this.withRetry(() =>
      this.get<StravaActivity[]>(endpoint, accessToken)
    );
  }

  /**
   * Get detailed activity information
   */
  async getActivityDetail(
    activityId: string,
    accessToken: string
  ): Promise<StravaActivity> {
    const endpoint = STRAVA_ENDPOINTS.ACTIVITY_DETAIL(activityId);

    return this.withRetry(() =>
      this.get<StravaActivity>(endpoint, accessToken)
    );
  }

  /**
   * Get activity photos
   */
  async getActivityPhotos(
    activityId: string,
    accessToken: string
  ): Promise<StravaPhoto[]> {
    const endpoint = STRAVA_ENDPOINTS.ACTIVITY_PHOTOS(activityId);

    try {
      return await this.withRetry(() =>
        this.get<StravaPhoto[]>(endpoint, accessToken)
      );
    } catch (error) {
      // Photos endpoint might not exist for some activities
      console.warn(`No photos found for activity ${activityId}:`, error);
      return [];
    }
  }

  /**
   * Get multiple activities with their photos in parallel
   */
  async getActivitiesWithPhotos(
    accessToken: string,
    page: number = 1,
    perPage: number = 30
  ): Promise<{
    activities: StravaActivity[];
    photos: Record<string, StravaPhoto[]>;
  }> {
    const activities = await this.getActivities(accessToken, page, perPage);

    // Get photos for activities that have them
    const activitiesWithPhotos = activities.filter(
      (activity) => activity.total_photo_count > 0
    );

    const photoPromises = activitiesWithPhotos.map(async (activity) => {
      const photos = await this.getActivityPhotos(
        activity.id.toString(),
        accessToken
      );
      return { activityId: activity.id.toString(), photos };
    });

    const photoResults = await Promise.allSettled(photoPromises);

    const photos: Record<string, StravaPhoto[]> = {};
    photoResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        photos[result.value.activityId] = result.value.photos;
      } else {
        console.warn(
          `Failed to fetch photos for activity ${activitiesWithPhotos[index].id}:`,
          result.reason
        );
        photos[activitiesWithPhotos[index].id.toString()] = [];
      }
    });

    return { activities, photos };
  }
}

// Singleton instance
export const stravaApiService = new StravaApiService();

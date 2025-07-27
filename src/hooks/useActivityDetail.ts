import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { stravaApiService } from "@/services/stravaApi";
import type { StravaActivity, StravaPhoto } from "@/types";

export interface UseActivityDetailReturn {
  activity: StravaActivity | null;
  photos: StravaPhoto[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook for fetching detailed activity data
 */
export function useActivityDetail(activityId: string): UseActivityDetailReturn {
  const { data: session } = useSession();

  const [activity, setActivity] = useState<StravaActivity | null>(null);
  const [photos, setPhotos] = useState<StravaPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityDetail = useCallback(async () => {
    if (!session?.accessToken || !activityId) {
      setError("No access token or activity ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch activity detail and photos in parallel
      const [activityData, photosData] = await Promise.allSettled([
        stravaApiService.getActivityDetail(activityId, session.accessToken),
        stravaApiService.getActivityPhotos(activityId, session.accessToken),
      ]);

      if (activityData.status === "fulfilled") {
        setActivity(activityData.value);
      } else {
        throw new Error("Failed to fetch activity details");
      }

      if (photosData.status === "fulfilled") {
        setPhotos(photosData.value);
      } else {
        console.warn(
          "Failed to fetch activity photos, continuing without photos"
        );
        setPhotos([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch activity";
      setError(errorMessage);
      console.error("Error fetching activity detail:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, activityId]);

  const refresh = () => {
    setActivity(null);
    setPhotos([]);
    fetchActivityDetail();
  };

  useEffect(() => {
    if (session?.accessToken && activityId) {
      fetchActivityDetail();
    }
  }, [session?.accessToken, activityId, fetchActivityDetail]);

  return {
    activity,
    photos,
    loading,
    error,
    refresh,
  };
}

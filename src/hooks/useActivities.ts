import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { stravaApiService } from "@/services/stravaApi";
import type { StravaActivity, StravaPhoto } from "@/types";

export interface UseActivitiesOptions {
  page?: number;
  perPage?: number;
  autoFetch?: boolean;
}

export interface UseActivitiesReturn {
  activities: StravaActivity[];
  photos: Record<string, StravaPhoto[]>;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: () => void;
  refresh: () => void;
}

/**
 * Hook for fetching and managing activities data
 */
export function useActivities(
  options: UseActivitiesOptions = {}
): UseActivitiesReturn {
  const { page = 1, perPage = 30, autoFetch = true } = options;
  const { data: session } = useSession();

  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [photos, setPhotos] = useState<Record<string, StravaPhoto[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (!session?.accessToken) {
        setError("No access token available");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Only fetch activities, not photos - this reduces API calls dramatically
        const activities = await stravaApiService.getActivities(
          session.accessToken,
          pageNum,
          perPage
        );

        if (append) {
          setActivities((prev) => [...prev, ...activities]);
        } else {
          setActivities(activities);
          setPhotos({}); // Clear photos when not appending
        }

        // Check if we have more data
        setHasMore(activities.length === perPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch activities";
        setError(errorMessage);
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    },
    [session?.accessToken, perPage]
  );

  const fetchMore = () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchActivities(nextPage, true);
  };

  const refresh = () => {
    setCurrentPage(1);
    setActivities([]);
    setPhotos({});
    setHasMore(true);
    fetchActivities(1, false);
  };

  useEffect(() => {
    if (autoFetch && session?.accessToken) {
      fetchActivities(1, false);
    }
  }, [session?.accessToken, autoFetch, fetchActivities]);

  return {
    activities,
    photos,
    loading,
    error,
    hasMore,
    fetchMore,
    refresh,
  };
}

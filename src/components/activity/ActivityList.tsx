import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ActivityCard } from "./ActivityCard";
import type { StravaActivity, StravaPhoto } from "@/types";

interface ActivityListProps {
  activities: StravaActivity[];
  photos: Record<string, StravaPhoto[]>;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ActivityList({
  activities,
  photos,
  loading,
  hasMore,
  onLoadMore,
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No activities found"
        description="Start tracking your workouts with Strava to see them here!"
        icon={
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        }
        action={
          <Button variant="primary">
            <a
              href="https://www.strava.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Strava
            </a>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            photos={photos[activity.id.toString()] || []}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            loading={loading}
            variant="outline"
            size="lg"
          >
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}

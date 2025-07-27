import { useActivities } from "@/hooks/useActivities";
import { Header } from "./Header";
import { ActivityList } from "@/components/activity/ActivityList";
import { LoadingState } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function Dashboard() {
  const { activities, photos, loading, error, hasMore, fetchMore, refresh } =
    useActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Your Activities
            </h2>
            <p className="text-gray-600 mt-1">
              Track your progress and analyze your performance
            </p>
          </div>

          <Button onClick={refresh} variant="outline" disabled={loading}>
            Refresh
          </Button>
        </div>

        <LoadingState
          loading={loading && activities.length === 0}
          error={error}
        >
          <ActivityList
            activities={activities}
            photos={photos}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={fetchMore}
          />
        </LoadingState>
      </main>
    </div>
  );
}

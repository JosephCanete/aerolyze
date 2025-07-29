import { useActivities } from "@/hooks/useActivities";
import { Header } from "./Header";
import { ActivityList } from "@/components/activity/ActivityList";
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

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-600 mb-2">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Something went wrong
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        ) : (
          <ActivityList
            activities={activities}
            photos={photos}
            loading={loading && activities.length === 0}
            loadingMore={loading && activities.length > 0}
            hasMore={hasMore}
            onLoadMore={fetchMore}
          />
        )}
      </main>
    </div>
  );
}

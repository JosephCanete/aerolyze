import { useState, useMemo, useRef, useEffect } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ActivityCard } from "./ActivityCard";
import type { StravaActivity, StravaPhoto } from "@/types";

interface ActivityListProps {
  activities: StravaActivity[];
  photos: Record<string, StravaPhoto[]>;
  loading: boolean;
  loadingMore?: boolean; // New prop for pagination loading
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ActivityList({
  activities,
  photos,
  loading,
  loadingMore = false,
  hasMore,
  onLoadMore,
}: ActivityListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get unique activity types for filter
  const activityTypes = useMemo(() => {
    const types = Array.from(new Set(activities.map(a => a.type)));
    return types.sort();
  }, [activities]);

  // Filter activities based on search and type
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || activity.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [activities, searchTerm, selectedType]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalDistance = filteredActivities.reduce((sum, a) => sum + a.distance, 0);
    const totalTime = filteredActivities.reduce((sum, a) => sum + a.moving_time, 0);
    const totalElevation = filteredActivities.reduce((sum, a) => sum + (a.total_elevation_gain || 0), 0);
    
    return {
      count: filteredActivities.length,
      totalDistance: Math.round(totalDistance / 1000 * 10) / 10, // km with 1 decimal
      totalTime: Math.round(totalTime / 3600 * 10) / 10, // hours with 1 decimal  
      totalElevation: Math.round(totalElevation),
    };
  }, [filteredActivities]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, onLoadMore]);

  if (activities.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <EmptyState
          title="No activities found"
          description="Start tracking your workouts with Strava to see them here!"
          icon={
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
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
            </div>
          }
          action={
            <Button variant="primary" size="lg">
              <a
                href="https://www.strava.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <span>Go to Strava</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search, Filters, and Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activities.length === 0 && loading ? (
          // Loading state for header
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse mx-auto w-16"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse mx-auto w-12"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Activity Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="all">All Activities</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid" 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Grid view"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="List view"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalDistance}km</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalTime}h</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalElevation}m</div>
                <div className="text-sm text-gray-600">Elevation</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Activities Grid/List */}
      {filteredActivities.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching activities</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              photos={photos[activity.id.toString()] || []}
            />
          ))}
        </div>
      ) : null}

      {/* Loading skeleton cards - show during pagination loading or when no activities yet */}
      {(loadingMore || (loading && activities.length === 0)) && (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {[...Array(loadingMore ? 3 : 6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="animate-pulse">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse"></div>
                
                <div className="p-4 space-y-4">
                  {/* Title placeholder */}
                  <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded w-3/4 animate-pulse"></div>
                  </div>
                  
                  {/* Stats placeholders */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Footer placeholder */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-3">
                      <div className="h-4 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                      <div className="h-4 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="text-sm">Loading more activities...</span>
          </div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-10" />

      {/* Load more button (fallback) */}
      {hasMore && !loading && !loadingMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50"
          >
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}

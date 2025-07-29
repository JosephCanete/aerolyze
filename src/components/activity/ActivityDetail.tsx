import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ActivityMap } from "./ActivityMap";
import {
  formatDistance,
  formatTime,
  formatSpeed,
  formatPace,
  formatElevation,
  formatHeartRate,
  formatPower,
  getActivityEmoji,
} from "@/utils/formatters";
import { formatDate } from "@/utils/helpers";
import type { StravaActivity, StravaPhoto } from "@/types";

interface ActivityDetailProps {
  activity: StravaActivity;
  photos: StravaPhoto[];
}

export function ActivityDetail({ activity, photos }: ActivityDetailProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const hasPerformanceData =
    activity.average_speed > 0 ||
    activity.average_heartrate > 0 ||
    activity.average_watts > 0;

  // Filter and prepare photos for gallery
  const validPhotos = photos.filter(
    (photo) => photo.urls?.["600"] && photo.urls["600"].trim() !== ""
  );

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === validPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? validPhotos.length - 1 : prev - 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeGallery();
          break;
        case 'ArrowLeft':
          previousImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, nextImage, previousImage]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGalleryOpen]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getActivityEmoji(activity.type)} {activity.name}
              </h1>
              <p className="text-gray-600">
                {formatDate(activity.start_date_local)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Activity Type</div>
              <div className="text-lg font-semibold">{activity.type}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Photos */}
      {validPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Photos ({validPhotos.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {validPhotos.map((photo, index) => (
                <div
                  key={photo.unique_id}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={photo.urls["600"]}
                    alt={photo.caption || "Activity photo"}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-4 h-4 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Photo Gallery Modal */}
      {isGalleryOpen && validPhotos.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {validPhotos.length}
          </div>

          {/* Previous button */}
          {validPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {validPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validPhotos[currentImageIndex].urls["600"]}
              alt={validPhotos[currentImageIndex].caption || "Activity photo"}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Thumbnail navigation */}
          {validPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 rounded-lg p-2 max-w-[90vw] overflow-x-auto">
              {validPhotos.map((photo, index) => (
                <button
                  key={photo.unique_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-opacity ${
                    index === currentImageIndex ? 'ring-2 ring-white opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={photo.urls["600"]}
                    alt={photo.caption || "Activity photo"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatDistance(activity.distance)}
            </div>
            <div className="text-gray-600">Distance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatTime(activity.moving_time)}
            </div>
            <div className="text-gray-600">Moving Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatElevation(activity.total_elevation_gain)}
            </div>
            <div className="text-gray-600">Elevation Gain</div>
          </CardContent>
        </Card>
      </div>

      {/* Route Map */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Route Map
          </h2>
        </CardHeader>
        <CardContent>
          <ActivityMap activity={activity} />
        </CardContent>
      </Card>

      {/* Performance Stats */}
      {hasPerformanceData && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Performance</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {activity.average_speed > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Speed</div>
                  <div className="text-lg font-semibold">
                    {formatSpeed(activity.average_speed)}
                  </div>
                </div>
              )}

              {activity.average_speed > 0 &&
                ["Run", "TrailRun"].includes(activity.type) && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Avg Pace</div>
                    <div className="text-lg font-semibold">
                      {formatPace(activity.average_speed)}
                    </div>
                  </div>
                )}

              {activity.max_speed > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Max Speed</div>
                  <div className="text-lg font-semibold">
                    {formatSpeed(activity.max_speed)}
                  </div>
                </div>
              )}

              {activity.average_heartrate > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Avg Heart Rate
                  </div>
                  <div className="text-lg font-semibold">
                    {formatHeartRate(activity.average_heartrate)}
                  </div>
                </div>
              )}

              {activity.max_heartrate > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Max Heart Rate
                  </div>
                  <div className="text-lg font-semibold">
                    {formatHeartRate(activity.max_heartrate)}
                  </div>
                </div>
              )}

              {activity.average_watts > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Power</div>
                  <div className="text-lg font-semibold">
                    {formatPower(activity.average_watts)}
                  </div>
                </div>
              )}

              {activity.weighted_average_watts > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Weighted Avg Power
                  </div>
                  <div className="text-lg font-semibold">
                    {formatPower(activity.weighted_average_watts)}
                  </div>
                </div>
              )}

              {activity.kilojoules > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Energy</div>
                  <div className="text-lg font-semibold">
                    {Math.round(activity.kilojoules)} kJ
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Stats */}
      {(activity.kudos_count > 0 ||
        activity.comment_count > 0 ||
        activity.achievement_count > 0) && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Social</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              {activity.kudos_count > 0 && (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">👍</span>
                  <div>
                    <div className="text-lg font-semibold">
                      {activity.kudos_count}
                    </div>
                    <div className="text-sm text-gray-600">Kudos</div>
                  </div>
                </div>
              )}

              {activity.comment_count > 0 && (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">💬</span>
                  <div>
                    <div className="text-lg font-semibold">
                      {activity.comment_count}
                    </div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>
              )}

              {activity.achievement_count > 0 && (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏆</span>
                  <div>
                    <div className="text-lg font-semibold">
                      {activity.achievement_count}
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Details</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Elapsed Time:</span>
              <span className="ml-2 font-medium">
                {formatTime(activity.elapsed_time)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Activity ID:</span>
              <span className="ml-2 font-medium">{activity.id}</span>
            </div>
            {activity.gear_id && (
              <div>
                <span className="text-gray-600">Gear:</span>
                <span className="ml-2 font-medium">{activity.gear_id}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Private:</span>
              <span className="ml-2 font-medium">
                {activity.private ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

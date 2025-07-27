import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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
  const hasPerformanceData =
    activity.average_speed > 0 ||
    activity.average_heartrate > 0 ||
    activity.average_watts > 0;

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
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Photos</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos
                .filter(
                  (photo) =>
                    photo.urls?.["600"] && photo.urls["600"].trim() !== ""
                )
                .map((photo) => (
                  <div key={photo.unique_id} className="relative aspect-square">
                    <Image
                      src={photo.urls["600"]}
                      alt={photo.caption || "Activity photo"}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
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

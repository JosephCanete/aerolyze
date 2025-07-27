import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import {
  formatDistance,
  formatTime,
  getActivityEmoji,
} from "@/utils/formatters";
import { formatDate } from "@/utils/helpers";
import type { StravaActivity, StravaPhoto } from "@/types";

interface ActivityCardProps {
  activity: StravaActivity;
  photos?: StravaPhoto[];
}

export function ActivityCard({ activity, photos = [] }: ActivityCardProps) {
  const primaryPhoto = photos[0];
  const photoUrl = primaryPhoto?.urls?.["600"];
  const hasValidPhoto = photoUrl && photoUrl.trim() !== "";

  return (
    <Link href={`/activity/${activity.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {hasValidPhoto && (
          <div className="relative h-48">
            <Image
              src={photoUrl}
              alt={`Photo from ${activity.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute top-4 left-4">
              <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-full text-sm font-medium">
                {getActivityEmoji(activity.type)} {activity.type}
              </span>
            </div>
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(activity.start_date_local)}
              </p>
            </div>
            {!hasValidPhoto && (
              <div className="ml-3 text-2xl">
                {getActivityEmoji(activity.type)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatDistance(activity.distance)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatTime(activity.moving_time)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {activity.kudos_count > 0 && (
                <div className="flex items-center">
                  <span className="mr-1">👍</span>
                  {activity.kudos_count}
                </div>
              )}
              {activity.comment_count > 0 && (
                <div className="flex items-center">
                  <span className="mr-1">💬</span>
                  {activity.comment_count}
                </div>
              )}
              {activity.total_photo_count > 0 && (
                <div className="flex items-center">
                  <span className="mr-1">📷</span>
                  {activity.total_photo_count}
                </div>
              )}
            </div>

            {activity.total_elevation_gain > 0 && (
              <div className="flex items-center">
                <span className="mr-1">⛰️</span>
                {Math.round(activity.total_elevation_gain)}m
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

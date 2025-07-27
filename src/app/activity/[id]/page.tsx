"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActivityDetail } from "@/hooks/useActivityDetail";
import { ActivityDetail } from "@/components/activity/ActivityDetail";
import { LoadingState } from "@/components/ui/LoadingSpinner";

export default function ActivityPage() {
  const params = useParams();
  const { data: session } = useSession();

  // Always call hooks at the top level
  const activityId = params?.id as string;
  const { activity, photos, loading, error } = useActivityDetail(activityId);

  if (!params?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Activity not found
          </h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view activity details
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingState loading={loading} error={error}>
        {activity && <ActivityDetail activity={activity} photos={photos} />}
      </LoadingState>
    </div>
  );
}

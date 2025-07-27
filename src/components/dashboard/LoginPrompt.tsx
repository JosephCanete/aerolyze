import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function LoginPrompt() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aerolyze</h1>
            <p className="text-gray-600">
              Connect your Strava account to analyze your activities
            </p>
          </div>

          <div className="mb-8">
            <svg
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>

          <Button
            onClick={() => signIn("strava")}
            variant="primary"
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
            </svg>
            Connect with Strava
          </Button>

          <p className="mt-4 text-xs text-gray-500">
            By connecting, you agree to share your Strava activity data with
            Aerolyze
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

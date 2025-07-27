import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Aerolyze</h1>
            <span className="ml-3 text-sm text-gray-600">
              Powered by Strava
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full mr-2"
                />
              )}
              <span className="text-sm font-medium text-gray-900">
                {session.user?.name}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

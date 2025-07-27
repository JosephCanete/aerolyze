// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stravaId?: number;
      username?: string;
      city?: string;
      state?: string;
      country?: string;
      sex?: string;
      premium?: boolean;
      summit?: boolean;
      badge_type_id?: number;
      weight?: number;
      profile_medium?: string;
      resource_state?: number;
      athlete_type?: number;
      date_preference?: string;
      measurement_preference?: string;
      clubs?: unknown[];
      ftp?: number;
      bikes?: unknown[];
      shoes?: unknown[];
    };
  }
}

import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

interface StravaProfile {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: null;
  follower: null;
  athlete_type: number;
  date_preference: string;
  measurement_preference: string;
  clubs: unknown[];
  ftp: number;
  bikes: unknown[];
  shoes: unknown[];
  email: string;
}

// Debug: Check if environment variables are loaded
console.log("Strava Client ID present:", !!process.env.STRAVA_CLIENT_ID);
console.log(
  "Strava Client Secret present:",
  !!process.env.STRAVA_CLIENT_SECRET
);
console.log("NextAuth Secret present:", !!process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "strava",
      name: "Strava",
      type: "oauth",
      authorization: {
        url: "https://www.strava.com/oauth/authorize",
        params: {
          scope: "read,activity:read_all,profile:read_all",
          response_type: "code",
        },
      },
      token: {
        url: "https://www.strava.com/oauth/token",
        async request({ params, provider }) {
          console.log("Token request params:", params);
          const response = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: new URLSearchParams({
              client_id: provider.clientId!,
              client_secret: provider.clientSecret!,
              code: params.code!,
              grant_type: "authorization_code",
            }),
          });

          console.log("Token response status:", response.status);
          const tokens = await response.json();
          console.log("Token response:", tokens);

          if (!response.ok) {
            throw new Error(
              `Token exchange failed: ${response.status} ${response.statusText}`
            );
          }

          return { tokens };
        },
      },
      userinfo: "https://www.strava.com/api/v3/athlete",
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      profile(profile: StravaProfile) {
        return {
          id: profile.id.toString(),
          name: `${profile.firstname} ${profile.lastname}`,
          email: profile.email,
          image: profile.profile,
          stravaId: profile.id,
          username: profile.username,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          sex: profile.sex,
          premium: profile.premium,
          summit: profile.summit,
          badge_type_id: profile.badge_type_id,
          weight: profile.weight,
          profile_medium: profile.profile_medium,
          resource_state: profile.resource_state,
          athlete_type: profile.athlete_type,
          date_preference: profile.date_preference,
          measurement_preference: profile.measurement_preference,
          clubs: profile.clubs,
          ftp: profile.ftp,
          bikes: profile.bikes,
          shoes: profile.shoes,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        const stravaProfile = profile as StravaProfile;
        token.stravaId = stravaProfile.id;
        token.username = stravaProfile.username;
        token.city = stravaProfile.city;
        token.state = stravaProfile.state;
        token.country = stravaProfile.country;
        token.sex = stravaProfile.sex;
        token.premium = stravaProfile.premium;
        token.summit = stravaProfile.summit;
        token.badge_type_id = stravaProfile.badge_type_id;
        token.weight = stravaProfile.weight;
        token.profile_medium = stravaProfile.profile_medium;
        token.resource_state = stravaProfile.resource_state;
        token.athlete_type = stravaProfile.athlete_type;
        token.date_preference = stravaProfile.date_preference;
        token.measurement_preference = stravaProfile.measurement_preference;
        token.clubs = stravaProfile.clubs;
        token.ftp = stravaProfile.ftp;
        token.bikes = stravaProfile.bikes;
        token.shoes = stravaProfile.shoes;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).accessToken = token.accessToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).refreshToken = token.refreshToken;
        session.user.stravaId = token.stravaId as number;
        session.user.username = token.username as string;
        session.user.city = token.city as string;
        session.user.state = token.state as string;
        session.user.country = token.country as string;
        session.user.sex = token.sex as string;
        session.user.premium = token.premium as boolean;
        session.user.summit = token.summit as boolean;
        session.user.badge_type_id = token.badge_type_id as number;
        session.user.weight = token.weight as number;
        session.user.profile_medium = token.profile_medium as string;
        session.user.resource_state = token.resource_state as number;
        session.user.athlete_type = token.athlete_type as number;
        session.user.date_preference = token.date_preference as string;
        session.user.measurement_preference =
          token.measurement_preference as string;
        session.user.clubs = token.clubs as unknown[];
        session.user.ftp = token.ftp as number;
        session.user.bikes = token.bikes as unknown[];
        session.user.shoes = token.shoes as unknown[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  events: {
    async signIn(message) {
      console.log("NextAuth signIn event:", message);
    },
    async signOut(message) {
      console.log("NextAuth signOut event:", message);
    },
    async session(message) {
      console.log("NextAuth session event:", message);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);

// Strava API Types
export interface StravaAthlete {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: "M" | "F";
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: unknown;
  follower: unknown;
}

export interface StravaActivity {
  resource_state: number;
  athlete: {
    id: number;
    resource_state: number;
  };
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: number | null;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  location_city: string | null;
  location_state: string | null;
  location_country: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_watts: number;
  weighted_average_watts: number;
  kilojoules: number;
  device_watts: boolean;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number;
  elev_low: number;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score: number;
}

export interface StravaPhoto {
  unique_id: string;
  urls: {
    "100": string;
    "600": string;
  };
  source: number;
  uploaded_at: string;
  created_at: string;
  caption: string;
  type: string;
  location: unknown;
  activity_id: number;
  activity_name: string;
  resource_state: number;
}

// Application Types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  stravaId?: number;
  accessToken?: string;
}

export interface ActivityCardProps {
  activity: StravaActivity;
  photos?: StravaPhoto[];
}

export interface ActivityDetailProps {
  activity: StravaActivity;
  photos?: StravaPhoto[];
}

// API Response Types
export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

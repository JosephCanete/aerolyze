import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// Mock next-auth
vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/providers/oauth", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => "/",
  useParams: () => ({}),
}));

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement("img", props);
  },
}));

// Mock environment variables
process.env.STRAVA_CLIENT_ID = "test-client-id";
process.env.STRAVA_CLIENT_SECRET = "test-client-secret";
process.env.NEXTAUTH_SECRET = "test-nextauth-secret";
process.env.NEXTAUTH_URL = "http://localhost:3002";

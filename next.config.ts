import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dgalywyr863hv.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "strava.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.strava.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

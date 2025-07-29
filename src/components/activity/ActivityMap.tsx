"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { StravaActivity } from "@/types";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), {
  ssr: false,
});

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface ActivityMapProps {
  activity: StravaActivity;
}

// Component to fit map bounds to the route
function MapBounds({ coordinates }: { coordinates: [number, number][] }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && coordinates.length > 0) {
      // We'll handle bounds fitting in the MapContainer initialization
    }
  }, [coordinates]);

  return null;
}

export function ActivityMap({ activity }: ActivityMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);
  // Decode Strava's polyline format
  const decodePolyline = (str: string): [number, number][] => {
    if (typeof window !== 'undefined') {
      const polyline = require("polyline");
      return polyline.decode(str);
    }
    return [];
  };

  // Check if we have map data
  if (!activity.map?.summary_polyline || !activity.start_latlng) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No route data available</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          This activity doesn't have GPS route information. Route maps are available for activities 
          recorded with GPS-enabled devices.
        </p>
      </div>
    );
  }

  const routeCoordinates = decodePolyline(activity.map.summary_polyline);
  const startPoint = activity.start_latlng;
  const endPoint = activity.end_latlng;

  // Calculate bounds for the route
  const calculateBounds = (coords: [number, number][]): [[number, number], [number, number]] | null => {
    if (coords.length === 0) return null;
    
    let minLat = coords[0][0];
    let maxLat = coords[0][0];
    let minLng = coords[0][1];
    let maxLng = coords[0][1];

    coords.forEach(([lat, lng]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    return [[minLat, minLng], [maxLat, maxLng]];
  };

  const bounds = calculateBounds(routeCoordinates);

  // Create custom icons for start/finish
  const createCustomIcon = (color: string, symbol: string) => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      return L.divIcon({
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${symbol}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    }
    return null;
  };

  const startIcon = createCustomIcon('#22c55e', 'S');
  const finishIcon = createCustomIcon('#ef4444', 'F');

  // Fullscreen overlay component
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
        <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
          {/* Fullscreen Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
            </div>
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>

          {/* Fullscreen Map */}
          <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
            <MapContainer
              center={startPoint}
              bounds={bounds || undefined}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Route polyline with Strava orange color */}
              <Polyline
                positions={routeCoordinates}
                color="#FC4C02"
                weight={5}
                opacity={0.9}
                // @ts-ignore - React Leaflet types issue
                lineCap="round"
                lineJoin="round"
              />

              {/* Start marker */}
              {startIcon && (
                <Marker position={startPoint} icon={startIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-green-600">Start</strong>
                      <br />
                      <span className="text-sm text-gray-600">
                        {new Date(activity.start_date_local).toLocaleTimeString()}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* End marker (only if different from start) */}
              {endPoint && finishIcon && 
               (endPoint[0] !== startPoint[0] || endPoint[1] !== startPoint[1]) && (
                <Marker position={endPoint} icon={finishIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-red-600">Finish</strong>
                      <br />
                      <span className="text-sm text-gray-600">
                        {activity.moving_time ? 
                          new Date(new Date(activity.start_date_local).getTime() + activity.moving_time * 1000).toLocaleTimeString() 
                          : 'End of activity'
                        }
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-900 p-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg"
        title="View fullscreen"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
      {/* Regular Map Container */}
      <MapContainer
        center={startPoint}
        bounds={bounds || undefined}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route polyline with Strava orange color */}
        <Polyline
          positions={routeCoordinates}
          color="#FC4C02"
          weight={4}
          opacity={0.8}
          // @ts-ignore - React Leaflet types issue
          lineCap="round"
          lineJoin="round"
        />

        {/* Start marker */}
        {startIcon && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>
              <div className="text-center">
                <strong className="text-green-600">Start</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {new Date(activity.start_date_local).toLocaleTimeString()}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* End marker (only if different from start) */}
        {endPoint && finishIcon && 
         (endPoint[0] !== startPoint[0] || endPoint[1] !== startPoint[1]) && (
          <Marker position={endPoint} icon={finishIcon}>
            <Popup>
              <div className="text-center">
                <strong className="text-red-600">Finish</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {activity.moving_time ? 
                    new Date(new Date(activity.start_date_local).getTime() + activity.moving_time * 1000).toLocaleTimeString() 
                    : 'End of activity'
                  }
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

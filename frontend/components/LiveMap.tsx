"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

type Stop = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  radius_meters: number;
};

export default function LiveMap({
  userLat,
  userLng,
  stops,
  nextStop,
}: {
  userLat: number;
  userLng: number;
  stops: Stop[];
  nextStop: Stop | null;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center">
        <p className="text-white/60">Map loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={[userLat, userLng] as [number, number]}
        zoom={17}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* User Marker */}
        <Marker position={[userLat, userLng] as [number, number]}>
          <Popup>You are here 📍</Popup>
        </Marker>

        {/* All Stops */}
        {stops.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng] as [number, number]}>
            <Popup>
              <b>{s.title}</b>
              <br />
              stopId: {s.id}
            </Popup>
          </Marker>
        ))}

        {/* Next stop radius ring */}
        {nextStop && (
          <Circle
            center={[nextStop.lat, nextStop.lng] as [number, number]}
            radius={nextStop.radius_meters}
          />
        )}
      </MapContainer>
    </div>
  );
}

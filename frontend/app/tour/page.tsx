"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LiveMap from "@/components/LiveMap";

type Stop = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  radius_meters: number;
};

export default function TourPage() {
  const router = useRouter();
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [status, setStatus] = useState("Initializing tour...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [sessionId, setSessionId] = useState<string>("");

  const [stops, setStops] = useState<Stop[]>([]);
  const [nextStopTitle, setNextStopTitle] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);

  const [triggeredStop, setTriggeredStop] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const lastTriggeredStopRef = useRef<string>("");
  const triggerLockRef = useRef<boolean>(false);

  const nextStop = stops.find((s) => s.title === nextStopTitle) || null;

  // ✅ Init tour: fetch stops + create session
  useEffect(() => {
    async function init() {
      try {
        if (!BACKEND) {
          setStatus("Missing NEXT_PUBLIC_BACKEND_URL");
          return;
        }

        setStatus("Fetching stops...");
        const stopsRes = await fetch(`${BACKEND}/api/stops`);
        const stopsData = await stopsRes.json();
        setStops(stopsData);

        setStatus("Creating session...");
        const sessRes = await fetch(`${BACKEND}/api/session/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const sessData = await sessRes.json();
        setSessionId(sessData.sessionId);

        setStatus("Session started ✅ Walk to first stop 🚶");
      } catch {
        setStatus("Error initializing tour. Check backend + CORS.");
      }
    }

    init();
  }, [BACKEND]);

  // ✅ GPS tracking + backend trigger
  useEffect(() => {
    if (!sessionId) return;

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({ lat, lng });

        try {
          const res = await fetch(`${BACKEND}/api/location/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, lat, lng }),
          });

          const data = await res.json();

          // Tour done
          if (data.done) {
            setStatus("Tour completed 🎉");
            router.push("/finish");
            return;
          }

          // Not triggered
          if (!data.triggered) {
            setNextStopTitle(data.nextStopTitle || "");
            if (data.distance != null) {
              setDistance(data.distance);
              setStatus(`Approaching ${data.nextStopTitle}...`);
            }
            return;
          }

          // Triggered
          if (data.triggered && data.stop?.id) {
            const stopId = data.stop.id as string;

            if (lastTriggeredStopRef.current === stopId) return;
            if (triggerLockRef.current) return;

            lastTriggeredStopRef.current = stopId;
            triggerLockRef.current = true;

            // vibration
            if ("vibrate" in navigator) {
              navigator.vibrate([150, 80, 150, 80, 300]);
            }

            // beep
            try {
              const beep = new Audio("/audio/beep.mp3");
              beep.play().catch(() => {});
            } catch {}

            setTriggeredStop({ id: stopId, title: data.stop.title });
            setStatus(`Unlocked: ${data.stop.title} ✅`);

            // Unlock after 5 seconds so user can interact with popup
            setTimeout(() => {
              triggerLockRef.current = false;
            }, 5000);
          }
        } catch {
          setStatus("Error sending location to backend.");
        }
      },
      (err) => setStatus(`Location error: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sessionId, BACKEND, router]);

  // UI helpers
  const distanceText =
    distance == null
      ? "—"
      : distance < 50
        ? `${distance}m (very close 🔥)`
        : `${distance}m`;

  const approachLevel =
    distance == null
      ? 0
      : distance < 30
        ? 3
        : distance < 80
          ? 2
          : distance < 200
            ? 1
            : 0;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">🧭 Live Tour</h1>
          <div className="text-xs text-white/70">
            {sessionId ? "Session ✅" : "Starting..."}
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-white/60 text-xs">STATUS</p>
          <p className="text-white font-semibold mt-1">{status}</p>

          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-xl bg-black/40 border border-white/10 p-3">
              <p className="text-white/60 text-xs">NEXT STOP</p>
              <p className="font-semibold">{nextStopTitle || "Loading..."}</p>
            </div>
            <div className="w-36 rounded-xl bg-black/40 border border-white/10 p-3">
              <p className="text-white/60 text-xs">DISTANCE</p>
              <p className="font-semibold">{distanceText}</p>
            </div>
          </div>

          {/* Radar bar */}
          <div className="mt-4">
            <p className="text-white/60 text-xs mb-2">RADAR</p>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width:
                    approachLevel === 3
                      ? "95%"
                      : approachLevel === 2
                        ? "70%"
                        : approachLevel === 1
                          ? "40%"
                          : "10%",
                }}
              />
            </div>
            <p className="text-white/50 text-xs mt-2">
              {approachLevel === 3
                ? "YOU'RE INSIDE THE ZONE 🔥"
                : approachLevel === 2
                  ? "Very close… keep walking"
                  : approachLevel === 1
                    ? "Approaching…"
                    : "Far. Move towards next stop"}
            </p>
          </div>
        </div>

        {/* Map (only when coords available) */}
        {coords && (
          <LiveMap
            userLat={coords.lat}
            userLng={coords.lng}
            stops={stops}
            nextStop={nextStop}
          />
        )}

        {/* Coords */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-white/60 text-xs">YOUR GPS</p>
          <p className="text-sm mt-1">
            {coords
              ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
              : "Waiting..."}
          </p>
        </div>
      </div>

      {/* 🎬 Triggered popup with button */}
      {triggeredStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-black border border-white/20 p-8 text-center shadow-xl">
            <p className="text-white/70 text-xs mb-3 uppercase tracking-wider">
              ✨ Location Unlocked
            </p>
            <h2 className="text-white text-3xl font-bold mb-1">
              {triggeredStop.title}
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Ready to explore this location?
            </p>

            <button
              onClick={() => {
                router.push(`/overlay/${triggeredStop.id}`);
                setTriggeredStop(null);
              }}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition mb-3"
            >
              View Story 📖
            </button>

            <button
              onClick={() => setTriggeredStop(null)}
              className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              Continue Exploring 🗺️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

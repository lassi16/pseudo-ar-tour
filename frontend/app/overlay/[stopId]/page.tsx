"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CameraOverlay from "@/components/CameraOverlay";

type Stop = {
  id: string;
  title: string;
  story: string;
  overlay_image: string;
  audio_src: string | null;
};

export default function OverlayDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const stopId = params.stopId as string;

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [stop, setStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStop() {
      try {
        const res = await fetch(`${BACKEND}/api/stops/${stopId}`);
        if (!res.ok) throw new Error("Stop not found");
        const data: Stop = await res.json();
        setStop(data);
      } catch (e) {
        setStop(null);
      } finally {
        setLoading(false);
      }
    }

    if (!BACKEND) return;
    fetchStop();
  }, [BACKEND, stopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading story...
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-white bg-black">
        <p>Stop not found ❌</p>
        <button
          className="px-4 py-2 rounded-xl bg-white text-black font-semibold"
          onClick={() => router.push("/tour")}
        >
          Back to tour
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <CameraOverlay
        title={stop.title}
        story={stop.story}
        overlayImage={stop.overlay_image}
        audioSrc={stop.audio_src || undefined}
      />

      {/* Continue Tour */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <button
          onClick={() => router.push("/tour")}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          Continue Tour ➜
        </button>
      </div>
    </div>
  );
}

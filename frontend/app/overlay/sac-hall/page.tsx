"use client";

import { useRouter } from "next/navigation";
import CameraOverlay from "@/components/CameraOverlay";

export default function SacHallOverlay() {
  const router = useRouter();

  return (
    <div className="relative">
      <CameraOverlay
        title="SAC Hall"
        story="This hall has seen countless late-night hackathons and team battles 🔥"
        overlayImage="/overlays/sac.png"
        audioSrc="/audio/sac.mp3"
        
      />

      {/* Next button fixed */}
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

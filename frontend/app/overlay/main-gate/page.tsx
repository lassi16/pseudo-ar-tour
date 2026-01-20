"use client";

import { useRouter } from "next/navigation";
import CameraOverlay from "@/components/CameraOverlay";

export default function MainGateOverlay() {
  const router = useRouter();

  return (
    <div className="relative">
      <CameraOverlay
        title="Main Gate"
        story="You’ve reached the end. But every explorer’s story continues..."
        overlayImage="/overlays/gate.png"
        audioSrc="/audio/gate.mp3"
      />

      <div className="absolute bottom-6 left-0 right-0 px-6">
        <button
          onClick={() => router.push("/finish")}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          Finish Tour 🎉
        </button>
      </div>
    </div>
  );
}

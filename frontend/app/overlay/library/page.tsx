"use client";

import { useRouter } from "next/navigation";
import CameraOverlay from "@/components/CameraOverlay";

export default function LibraryOverlay() {
  const router = useRouter();

  return (
    <div className="relative">
      <CameraOverlay
        title="Library"
        story="A silent powerhouse — more dreams are built here than anywhere else."
        overlayImage="/overlays/library.png"
        audioSrc="/audio/library.mp3"
      />

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

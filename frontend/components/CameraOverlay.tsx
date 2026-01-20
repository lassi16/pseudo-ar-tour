"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  story: string;
  overlayImage: string; // "/overlays/sac.png"
  audioSrc?: string; // "/audio/sac.mp3" (optional - can be bg music)
};

export default function CameraOverlay({ title, story, overlayImage, audioSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [error, setError] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);

  // ✅ Start camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // back camera
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setError("Camera permission denied or not available.");
      }
    }

    startCamera();

    return () => {
      // stop camera stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      // stop any speech
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ✅ Speak the story (Text-to-Speech)
  const speakStory = () => {
    try {
      if (!("speechSynthesis" in window)) {
        setError("Text-to-Speech not supported in this browser.");
        return;
      }

      // stop previous speech if any
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(story);
      utterance.rate = 1; // 0.8 slow | 1 normal | 1.2 fast
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError("");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setError("Speech failed. Try again.");
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setError("Unable to speak story on this device.");
    }
  };

  // ✅ Optional: play background music mp3
  const playBgMusic = async () => {
    try {
      if (!audioSrc) {
        setError("No bg audio file provided.");
        return;
      }

      const audio = new Audio(audioSrc);
      audio.volume = 0.5;
      await audio.play();

      setIsBgMusicPlaying(true);
      setError("");
    } catch (e) {
      setError("Tap once to enable audio playback.");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Overlay Image */}
      <img
        src={overlayImage}
        alt="overlay"
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[280px] max-w-[85%] drop-shadow-2xl opacity-90"
      />

      {/* Story Card */}
      <div className="absolute bottom-24 left-0 right-0 px-5">
        <div className="rounded-2xl bg-black/60 border border-white/10 p-4 backdrop-blur-md">
          <p className="text-white font-bold text-lg">📍 {title}</p>
          <p className="text-white/90 text-sm mt-2 leading-relaxed">{story}</p>

          {/* Speak story */}
          <button
            onClick={speakStory}
            className="mt-3 w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
          >
            {isSpeaking ? "🔊 Speaking story..." : "▶ Speak Story"}
          </button>

          {/* Optional bg music */}
          {audioSrc && (
            <button
              onClick={playBgMusic}
              className="mt-2 w-full py-3 rounded-xl bg-white/20 text-white font-semibold hover:opacity-90"
            >
              {isBgMusicPlaying ? "🎵 Music Playing" : "🎵 Play Background Music"}
            </button>
          )}

          {error && <p className="text-red-200 text-xs mt-2">{error}</p>}
        </div>
      </div>

      {/* Top Hint */}
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <div className="text-white/80 text-xs bg-black/40 px-3 py-2 rounded-full">
          Point camera around — story appears like AR ✨
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl shadow-lg p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">📍 Pseudo-AR Campus Tour</h1>
        <p className="text-gray-600">
          Walk around campus and your phone will narrate stories at each location.
        </p>

        <button
          onClick={() => router.push("/tour")}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          Start Tour 🚀
        </button>
      </div>
    </div>
  );
}

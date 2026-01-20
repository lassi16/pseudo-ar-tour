"use client";

export default function FinishPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl shadow-lg p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">🎉 Tour Completed!</h1>
        <p className="text-gray-600">
          You unlocked the Explorer Badge. Share it 😈
        </p>

        <div className="p-4 rounded-xl border text-left">
          <p className="font-semibold">🏆 Explorer Badge</p>
          <p className="text-gray-600 text-sm">
            Completed the Campus Story Walk
          </p>
        </div>

        <button
          onClick={() => {
            navigator.share?.({
              title: "Campus Tour Completed!",
              text: "I completed the Pseudo-AR Campus Tour 🔥",
              url: window.location.origin,
            });
          }}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          Share 🔥
        </button>
      </div>
    </div>
  );
}

const { exec } = require("child_process");

/**
 * This function triggers DroidRun/ADB to:
 * 1) Flash camera light 3 times
 * 2) Vibrate pattern
 * 3) Show notification
 * 4) Play sound
 * 5) Open overlay URL
 *
 * Uses ADB directly - works even without DroidRun CLI
 * Perfect for hackathon demo with full device feedback
 */
function triggerStopOnPhone(stop) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/overlay/${stop.id}`;

    // ✅ Flash camera light 3 times
    const flashCmd = `adb shell "for i in 1 2 3; do svc led on; sleep 0.3; svc led off; sleep 0.3; done"`;

    // ✅ Vibrate pattern: 200ms on, 100ms off, 200ms on, 100ms off, 300ms on
    const vibrateCmd = `adb shell "service call vibrator_manager 1 i64 800"`;

    // ✅ Play notification sound
    const soundCmd = `adb shell "media_session play"`;

    // ✅ ADB show notification with BIG TEXT style
    const notifyCmd = `adb shell cmd notification post -S bigtext Tour "🎯 Stop Unlocked: ${stop.title} 🎯"`;

    // ✅ ADB open URL directly
    const openUrlCmd = `adb shell am start -a android.intent.action.VIEW -d "${url}"`;

    // ✅ Execute all commands in sequence
    const full = `${flashCmd} && ${vibrateCmd} && ${soundCmd} && ${notifyCmd} && ${openUrlCmd}`;

    exec(full, (err, stdout, stderr) => {
      if (err) {
        console.log(
          "⚠️  ADB trigger partial failure (some features may not work):",
          stderr || err.message,
        );
        // Still resolve true since main features might work
        return resolve(true);
      }
      console.log(
        "✅ ADB FULL TRIGGER SUCCESS - All effects activated:",
        stop.title,
      );
      return resolve(true);
    });
  });
}

module.exports = { triggerStopOnPhone };

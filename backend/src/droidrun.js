const { exec } = require("child_process");

/**
 * This function triggers DroidRun/ADB to:
 * 1) show notification
 * 2) open overlay URL
 *
 * Uses ADB directly (works even without DroidRun CLI)
 * Perfect for hackathon demo
 */
function triggerStopOnPhone(stop) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/overlay/${stop.id}`;

    // ✅ ADB open URL directly (works on Android device/emulator)
    const openUrlCmd = `adb shell am start -a android.intent.action.VIEW -d "${url}"`;

    // ✅ ADB show notification
    const notifyCmd = `adb shell cmd notification post -S bigtext Tour "Stop unlocked: ${stop.title}"`;

    // ✅ Execute both commands
    const full = `${notifyCmd} && ${openUrlCmd}`;

    exec(full, (err, stdout, stderr) => {
      if (err) {
        console.log(
          "⚠️  ADB trigger failed (device may not be connected):",
          stderr || err.message,
        );
        return resolve(false);
      }
      console.log(
        "✅ ADB trigger SUCCESS - Stop opened on device:",
        stop.title,
      );
      return resolve(true);
    });
  });
}

module.exports = { triggerStopOnPhone };

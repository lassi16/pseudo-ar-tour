const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");
const { distanceMeters } = require("./utils");
const { triggerStopOnPhone } = require("./droidrun");

const router = express.Router();

/**
 * GET /api/stops
 * returns all stops
 */
router.get("/stops", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, lat, lng, radius_meters FROM stops ORDER BY id ASC",
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/stops/:id
 * returns a specific stop
 */
router.get("/stops/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM stops WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stop not found" });
    }

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/session/start
 * returns: { sessionId }
 */
router.post("/session/start", async (req, res) => {
  try {
    const sessionId = uuidv4();

    await pool.query(
      "INSERT INTO sessions (session_id, current_stop_index) VALUES ($1, 0)",
      [sessionId],
    );

    res.json({ sessionId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/location/update
 * body: { sessionId, lat, lng }
 * returns: { triggered, stop?, distance?, nextStopTitle?, done? }
 */
router.post("/location/update", async (req, res) => {
  try {
    const { sessionId, lat, lng } = req.body;

    if (!sessionId || lat == null || lng == null) {
      return res.status(400).json({ error: "sessionId, lat, lng required" });
    }

    // validate session
    const sessionRes = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId],
    );
    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ error: "Invalid sessionId" });
    }

    const currentStopIndex = sessionRes.rows[0].current_stop_index;

    // get stops
    const stopsRes = await pool.query("SELECT * FROM stops ORDER BY id ASC;");
    const stops = stopsRes.rows;

    const nextStop = stops[currentStopIndex];
    if (!nextStop) {
      return res.json({ triggered: false, done: true });
    }

    const d = distanceMeters(lat, lng, nextStop.lat, nextStop.lng);

    // inside radius => triggered
    if (d <= nextStop.radius_meters) {
      await pool.query(
        "UPDATE sessions SET current_stop_index = current_stop_index + 1 WHERE session_id = $1",
        [sessionId],
      );

      // ✅ CALL ADB/DROIDRUN MAGIC - trigger phone automation
      triggerStopOnPhone(nextStop); // async fire-and-forget

      return res.json({
        triggered: true,
        stop: nextStop,
      });
    }

    // not triggered
    res.json({
      triggered: false,
      distance: Math.round(d),
      nextStopTitle: nextStop.title,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

/**
 * SEED SCRIPT
 * Run this to populate your Neon database with sample stops
 * Usage: node seed.js
 */

require("dotenv").config();
const pool = require("./src/db");

const stops = [
  {
    id: "library",
    title: "📚 Library - IIT Patna",
    story:
      "The heart of academic excellence at IIT Patna. A silent powerhouse where dreams are built through knowledge and research. Students gather here to study, collaborate, and unlock worlds within thousands of books and digital resources.",
    overlay_image: "/overlays/library.png",
    audio_src: "/audio/library.mp3",
    lat: 25.5948,
    lng: 85.1385,
    radius_meters: 1000,
  },
  {
    id: "sac-hall",
    title: "🏛️ SAC Hall - IIT Patna",
    story:
      "Welcome to the vibrant heart of IIT Patna's cultural and social ecosystem! SAC Hall stands as a magnificent testament to the creative spirit and unity of our diverse student community. This iconic auditorium has witnessed countless moments of brilliance — from electrifying music performances and dance competitions that shake the foundations with energy, to thought-provoking theatrical productions that move audiences to tears. Here, techies transform into artists, engineers become musicians, and quiet library-dwellers step into the spotlight.\n\nEvery semester brings fresh energy as club performances, cultural fests, and inter-hostel competitions showcase the incredible talent hidden within our campus. The SAC Hall isn't just a venue; it's a space where traditions are born, where friendships are cemented over late-night event preparations, and where the bonds of our IIT Patna family grow stronger. Whether it's the thunderous applause during the annual cultural festival, the melodious echoes of our college band, or the inspirational words of guest speakers, this hall pulses with the heartbeat of student life.\n\nThousands of memories have been created within these walls — first performances, friendship declarations, and moments of pure joy that students carry with them long after graduation. SAC Hall represents the spirit of IIT Patna: a blend of academic excellence with creative expression, proving that engineers are not just builders of structures, but architects of dreams and culture.",
    overlay_image: "/overlays/sac-hall.png",
    audio_src: "/audio/sac-hall.mp3",
    lat: 25.5932,
    lng: 85.1392,
    radius_meters: 1000,
  },
  {
    id: "main-gate",
    title: "🚪 Main Gate - IIT Patna",
    story:
      "The iconic gateway to IIT Patna. Every student passes through here, beginning their transformative journey. A symbol of opportunity, growth, and the beginning of countless dreams at one of India's premier engineering institutes.",
    overlay_image: "/overlays/main-gate.png",
    audio_src: "/audio/main-gate.mp3",
    lat: 25.5925,
    lng: 85.1368,
    radius_meters: 1000,
  },
  {
    id: "academic-block",
    title: "🏢 Academic Block - IIT Patna",
    story:
      "The intellectual nerve center of IIT Patna. State-of-the-art classrooms, laboratories, and faculty offices. Where cutting-edge engineering education meets innovation and research excellence.",
    overlay_image: "/overlays/academic-block.png",
    audio_src: "/audio/academic-block.mp3",
    lat: 25.5955,
    lng: 85.1405,
    radius_meters: 1000,
  },
  {
    id: "central-dining",
    title: "🍽️ Central Dining Hall - IIT Patna",
    story:
      "More than just a place to eat. It's where friendships blossom, diverse cultures blend, and the campus community nourishes both body and spirit. A space of warmth and togetherness.",
    overlay_image: "/overlays/dining-hall.png",
    audio_src: "/audio/dining-hall.mp3",
    lat: 25.5938,
    lng: 85.1378,
    radius_meters: 1000,
  },
  {
    id: "sports-complex",
    title: "⚽ Sports Complex - IIT Patna",
    story:
      "Where passion meets excellence. A hub of athletic energy where students push their limits, teams compete fiercely, and champions are forged. The spirit of sportsmanship lives here.",
    overlay_image: "/overlays/sports-complex.png",
    audio_src: "/audio/sports-complex.mp3",
    lat: 25.5918,
    lng: 85.141,
    radius_meters: 1000,
  },
  {
    id: "hostel-complex",
    title: "🏠 Hostel Complex - IIT Patna",
    story:
      "Home away from home for thousands of students. Where bonds are forged, memories are created, and lifelong friendships are born. The backbone of campus life at IIT Patna.",
    overlay_image: "/overlays/hostel-complex.png",
    audio_src: "/audio/hostel-complex.mp3",
    lat: 25.596,
    lng: 85.135,
    radius_meters: 1000,
  },
  {
    id: "innovation-hub",
    title: "💡 Innovation Hub - IIT Patna",
    story:
      "Where ideas transform into reality. The epicenter of startup culture and technological innovation. Students collaborate, experiment, and build solutions that change the world.",
    overlay_image: "/overlays/innovation-hub.png",
    audio_src: "/audio/innovation-hub.mp3",
    lat: 25.5945,
    lng: 85.143,
    radius_meters: 1000,
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Drop existing stops (clear old data)
    await pool.query("DELETE FROM stops;");
    console.log("✅ Cleared existing stops\n");

    // Insert new stops
    for (const stop of stops) {
      await pool.query(
        `INSERT INTO stops (id, title, story, overlay_image, audio_src, lat, lng, radius_meters)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
         title = $2, story = $3, overlay_image = $4, audio_src = $5, lat = $6, lng = $7, radius_meters = $8`,
        [
          stop.id,
          stop.title,
          stop.story,
          stop.overlay_image,
          stop.audio_src,
          stop.lat,
          stop.lng,
          stop.radius_meters,
        ],
      );
      console.log(`✅ Inserted/Updated: ${stop.title}`);
    }

    console.log(`\n🎉 Seed complete! Added ${stops.length} stops.\n`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  }
}

seed();

/**
 * SEED SCRIPT
 * Run this to populate your Neon database with sample stops
 * Usage: node seed.js
 */

require("dotenv").config();
const pool = require("./src/db");

const stops = [
  {
    id: "main-gate",
    title: "🚪 Main Gate",
    story:
      "Entrance on Bihta-Kanpa Road. Every student passes through here, beginning their transformative journey. A symbol of opportunity, growth, and the beginning of countless dreams.",
    overlay_image: "/overlays/main-gate.png",
    audio_src: "/audio/main-gate.mp3",
    lat: 25.5415,
    lng: 84.8512,
    radius_meters: 1000,
  },
  {
    id: "academic-block",
    title: "🏢 Academic Block (Tutorial)",
    story:
      "Includes Block 9 and main lecture halls. The intellectual nerve center with state-of-the-art classrooms, laboratories, and faculty offices. Where cutting-edge engineering education meets innovation and research excellence.",
    overlay_image: "/overlays/academic-block.png",
    audio_src: "/audio/academic-block.mp3",
    lat: 25.5395,
    lng: 84.8545,
    radius_meters: 1000,
  },
  {
    id: "library",
    title: "📚 Central Library",
    story:
      "Located within the Administrative Block (Block 12). The heart of academic excellence - a silent powerhouse where dreams are built through knowledge and research. Students gather here to study, collaborate, and unlock worlds within thousands of books and digital resources.",
    overlay_image: "/overlays/library.png",
    audio_src: "/audio/library.mp3",
    lat: 25.5358,
    lng: 84.8515,
    radius_meters: 1000,
  },
  {
    id: "sac-hall",
    title: "🏛️ SAC (Student Activity Center)",
    story:
      "Also known as the Gymkhana/SAC area. Welcome to the vibrant heart of student cultural and social ecosystem! SAC stands as a magnificent testament to the creative spirit and unity of our diverse student community. This iconic venue has witnessed countless moments of brilliance — from electrifying music performances and dance competitions that shake the foundations with energy, to thought-provoking theatrical productions that move audiences to tears.\n\nEvery semester brings fresh energy as club performances, cultural fests, and inter-hostel competitions showcase the incredible talent hidden within the campus. The SAC isn't just a venue; it's a space where traditions are born, where friendships are cemented over late-night event preparations, and where the bonds of our community grow stronger.\n\nThousands of memories have been created within these walls — first performances, friendship declarations, and moments of pure joy that students carry with them long after graduation.",
    overlay_image: "/overlays/sac-hall.png",
    audio_src: "/audio/sac-hall.mp3",
    lat: 25.5382,
    lng: 84.857,
    radius_meters: 1000,
  },
  {
    id: "central-dining",
    title: "🍽️ Central Dining Hall",
    story:
      "Near the boys' hostel complex. More than just a place to eat - it's where friendships blossom, diverse cultures blend, and the campus community nourishes both body and spirit. A space of warmth and togetherness.",
    overlay_image: "/overlays/dining-hall.png",
    audio_src: "/audio/dining-hall.mp3",
    lat: 25.5325,
    lng: 84.853,
    radius_meters: 1000,
  },
  {
    id: "sports-complex",
    title: "⚽ Sports Complex",
    story:
      "Main grounds for cricket, football, and athletics. Where passion meets excellence - a hub of athletic energy where students push their limits, teams compete fiercely, and champions are forged. The spirit of sportsmanship lives here.",
    overlay_image: "/overlays/sports-complex.png",
    audio_src: "/audio/sports-complex.mp3",
    lat: 25.5375,
    lng: 84.8585,
    radius_meters: 1000,
  },
  {
    id: "hostel-complex",
    title: "🏠 Hostel Complex (Boys)",
    story:
      "Includes APJ Abdul Kalam and CV Raman blocks. Home away from home for thousands of students. Where bonds are forged, memories are created, and lifelong friendships are born. The backbone of campus life.",
    overlay_image: "/overlays/hostel-complex.png",
    audio_src: "/audio/hostel-complex.mp3",
    lat: 25.531,
    lng: 84.8535,
    radius_meters: 1000,
  },
  {
    id: "innovation-hub",
    title: "💡 Innovation Hub / TIH",
    story:
      "Near the Academic and Administrative zones. Where ideas transform into reality. The epicenter of startup culture and technological innovation. Students collaborate, experiment, and build solutions that change the world.",
    overlay_image: "/overlays/innovation-hub.png",
    audio_src: "/audio/innovation-hub.mp3",
    lat: 25.5402,
    lng: 84.8538,
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

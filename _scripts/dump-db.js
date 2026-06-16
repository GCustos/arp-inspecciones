const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
const OUT = path.join(__dirname, "db-dump");

initializeApp({ credential: cert(KEY) });
const db = getFirestore();

const COLLECTIONS = ["usuarios", "instalaciones", "equipos", "inspecciones", "config"];

async function dumpCollection(name) {
  const snap = await db.collection(name).get();
  const docs = {};
  snap.forEach(d => { docs[d.id] = d.data(); });
  fs.writeFileSync(path.join(OUT, name + ".json"), JSON.stringify(docs, null, 2));
  console.log(`✓ ${name}: ${snap.size} docs`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const col of COLLECTIONS) {
    try { await dumpCollection(col); }
    catch(e) { console.warn(`  ! ${col}: ${e.message}`); }
  }
  console.log("\nListo → " + OUT);
  process.exit(0);
}

main();

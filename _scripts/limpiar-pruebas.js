const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY), storageBucket: "arp-inspecciones.firebasestorage.app" });
const db = getFirestore();
const bucket = getStorage().bucket();

async function main() {
  // 1. Borrar todas las inspecciones excepto TIROLINA GRAN CANARIAS
  const snap = await db.collection("inspecciones").get();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.instalacionId === "ECA_tirolina_gran_canarias") {
      console.log("CONSERVA:", doc.id, data.nombreInstalacion, data.estado);
      continue;
    }
    // Borrar fotos de Storage
    try {
      const [files] = await bucket.getFiles({ prefix: "inspecciones/" + doc.id + "/" });
      for (const f of files) {
        await f.delete();
        console.log("  Foto borrada:", f.name);
      }
    } catch(e) { console.log("  Sin fotos o error:", e.message); }

    await db.collection("inspecciones").doc(doc.id).delete();
    console.log("BORRADA:", doc.id, data.nombreInstalacion, data.estado);
  }

  // 2. Setear ultimaInspeccionId en TIROLINA GRAN CANARIAS
  await db.collection("instalaciones").doc("ECA_tirolina_gran_canarias").update({
    ultimaInspeccionId: "zyO5rr4hvBFNdzMOeaGx"
  });
  console.log("\n✓ ECA_tirolina_gran_canarias.ultimaInspeccionId = zyO5rr4hvBFNdzMOeaGx");

  console.log("\nListo.");
  process.exit();
}

main().catch(e => { console.error(e); process.exit(1); });

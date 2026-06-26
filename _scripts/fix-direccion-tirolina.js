const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY) });
const db = getFirestore();

async function fix() {
  // 1. Corregir instalación
  const instRef = db.collection("instalaciones").doc("ECA_tirolina_gran_canarias");
  await instRef.update({
    direccion: "C. Fondos de Segura, s/n",
    cp: "35019",
    localidad: "Las Palmas de Gran Canaria",
    municipio: "Las Palmas",
    provincia: "Las Palmas"
  });
  console.log("✓ Instalación ECA_tirolina_gran_canarias actualizada");

  // 2. Corregir inspección(es) que copian la dirección
  const inspSnap = await db.collection("inspecciones")
    .where("instalacionId", "==", "ECA_tirolina_gran_canarias").get();
  for (const doc2 of inspSnap.docs) {
    await doc2.ref.update({
      direccion: "C. Fondos de Segura, s/n",
      cp: "35019",
      localidad: "Las Palmas de Gran Canaria",
      municipio: "Las Palmas",
      provincia: "Las Palmas"
    });
    console.log("✓ Inspección " + doc2.id + " actualizada");
  }

  console.log("\nListo.");
  process.exit();
}

fix().catch(e => { console.error(e); process.exit(1); });

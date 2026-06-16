const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY) });
const db = getFirestore();

async function main() {
  const snap = await db.collection("usuarios").get();
  for (const doc of snap.docs) {
    const data = doc.data();
    if ("puedeFiremar" in data) {
      await doc.ref.update({
        puedeFirmar: data.puedeFiremar,
        puedeFiremar: FieldValue.delete()
      });
      console.log(`✓ ${doc.id}: puedeFiremar -> puedeFirmar`);
    }
  }
  console.log("Listo.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });

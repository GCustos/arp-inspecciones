const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY) });
const db = getFirestore();

async function main() {
  const email = "w.custos@gmail.com";
  await db.collection("usuarios").doc(email).set({
    activo: true,
    nombre: "Inspector Prueba",
    nombreCorto: "IP",
    rol: "inspector",
    sede: "MADRID",
    equiposAsignados: ["GON01", "INC01", "PIE01"],
    puedeFirmar: [],
    firmaUrl: "__PENDIENTE__"
  });
  console.log(`✓ Creado usuarios/${email}`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });

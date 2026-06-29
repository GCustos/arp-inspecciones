const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY) });
const auth = getAuth();
const db = getFirestore();

const EMAIL = "explorasifones@gmail.com";
const PASSWORD = "Insp2026Madrid!";
const NOMBRE = "David Reguero Martín";

async function main() {
  // 1. Auth
  try {
    await auth.getUserByEmail(EMAIL);
    console.log("Auth: usuario ya existe, actualizando contraseña...");
    const u = await auth.getUserByEmail(EMAIL);
    await auth.updateUser(u.uid, { password: PASSWORD, displayName: NOMBRE, emailVerified: true });
  } catch(e) {
    if (e.code === "auth/user-not-found") {
      await auth.createUser({ email: EMAIL, password: PASSWORD, displayName: NOMBRE, emailVerified: true });
      console.log("✓ Auth: cuenta creada");
    } else throw e;
  }

  // 2. Firestore
  await db.collection("usuarios").doc(EMAIL).set({
    nombre: NOMBRE,
    nombreCorto: "DR",
    rol: "inspector",
    activo: true,
    sede: "MADRID",
    equiposAsignados: [],
    firmaUrl: "__PENDIENTE__",
    puedeFirmar: []
  }, { merge: true });
  console.log("✓ Firestore: documento usuario creado");

  console.log("\nCredenciales:");
  console.log("  Email:", EMAIL);
  console.log("  Contraseña:", PASSWORD);
  console.log("  Sede: MADRID");
  console.log("  Equipos: pendiente de confirmar");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });

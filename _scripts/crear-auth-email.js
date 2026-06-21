const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const KEY = path.join(__dirname, "..", "arp-inspecciones-firebase-adminsdk-fbsvc-d1eb1c3e4b.json");
initializeApp({ credential: cert(KEY) });
const auth = getAuth();

const USUARIOS = [
  { email: "guimarcon.arp@gmail.com", password: "ARP2026admin!", displayName: "Guillermo Marco" },
  { email: "w.custos@gmail.com", password: "ARP2026test!", displayName: "Inspector Prueba" }
];

async function main() {
  for (const u of USUARIOS) {
    try {
      await auth.getUserByEmail(u.email);
      await auth.updateUser((await auth.getUserByEmail(u.email)).uid, {
        password: u.password,
        displayName: u.displayName
      });
      console.log(`✓ ${u.email}: actualizado con contraseña nueva`);
    } catch(e) {
      if (e.code === "auth/user-not-found") {
        await auth.createUser({
          email: u.email,
          password: u.password,
          displayName: u.displayName,
          emailVerified: true
        });
        console.log(`✓ ${u.email}: cuenta creada`);
      } else {
        console.error(`! ${u.email}: ${e.message}`);
      }
    }
  }
  console.log("\nContraseñas provisionales:");
  USUARIOS.forEach(u => console.log(`  ${u.email} → ${u.password}`));
  console.log("Cambiadlas tras el primer login.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });

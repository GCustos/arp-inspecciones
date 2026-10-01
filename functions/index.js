const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

function addYear(fechaISO) {
  const p = (fechaISO || "").split("-");
  if (p.length !== 3) return "";
  return (parseInt(p[0], 10) + 1) + "-" + p[1] + "-" + p[2];
}

function isBlank(s) {
  return !s || s === "__PENDIENTE__";
}

async function geocode(direccion, cp, localidad, municipio, provincia) {
  const parts = [direccion, cp, localidad, municipio, provincia, "España"]
    .filter((s) => s && !isBlank(s) && s.trim());
  if (!parts.length) return null;
  const q = encodeURIComponent(parts.join(", "));
  try {
    const resp = await fetch(
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + q,
      { headers: { "User-Agent": "ARP-Inspecciones/1.0 (arpprevencion.com)" } }
    );
    const r = await resp.json();
    if (r && r[0]) return { lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) };
  } catch (e) {
    // sin coords, se revisa manualmente — no es motivo para fallar la función
  }
  return null;
}

// Mantiene la colección pública certificados-publicos (leída por el mapa de
// arpprevencion.com) sincronizada con la inspección FAVORABLE más reciente de
// cada instalación, sin depender de que alguien recuerde correr el script manual.
exports.syncCertificadoPublico = onDocumentWritten("inspecciones/{inspeccionId}", async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  const before = event.data.before.exists ? event.data.before.data() : null;
  const instalacionId = (after && after.instalacionId) || (before && before.instalacionId);
  if (!instalacionId) return;

  const snap = await db.collection("inspecciones")
    .where("instalacionId", "==", instalacionId)
    .where("estado", "==", "completada")
    .where("resultado", "==", "FAVORABLE")
    .get();

  let masReciente = null;
  snap.forEach((doc) => {
    const d = doc.data();
    if (!d.fechaInspeccion) return;
    if (!masReciente || d.fechaInspeccion > masReciente.fechaInspeccion) masReciente = d;
  });

  const certRef = db.collection("certificados-publicos").doc(instalacionId);

  if (!masReciente) {
    await certRef.delete().catch(() => {});
    return;
  }

  const instSnap = await db.collection("instalaciones").doc(instalacionId).get();
  const inst = instSnap.exists ? instSnap.data() : {};

  let lat = inst.lat || null;
  let lng = inst.lng || null;
  if (!lat || !lng) {
    const geo = await geocode(
      inst.direccion || masReciente.direccion || "",
      inst.cp || masReciente.cp || "",
      inst.localidad || masReciente.localidad || "",
      inst.municipio || masReciente.municipio || "",
      inst.provincia || masReciente.provincia || ""
    );
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
      await db.collection("instalaciones").doc(instalacionId).update({ lat, lng }).catch(() => {});
    }
  }

  const lugar = [inst.municipio || masReciente.municipio, inst.provincia || masReciente.provincia]
    .filter((s) => s && !isBlank(s))
    .join(", ");

  await certRef.set({
    nombre: masReciente.nombreInstalacion || "",
    lugar: lugar,
    lat: lat,
    lng: lng,
    fechaValidez: addYear(masReciente.fechaInspeccion),
    tipo: masReciente.tipoAlcance || "PAA",
    actualizadoEn: admin.firestore.FieldValue.serverTimestamp()
  });
});

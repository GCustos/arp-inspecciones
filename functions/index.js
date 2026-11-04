const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

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
// arpprevencion.com) sincronizada con las inspecciones FAVORABLES completadas, sin
// depender de que alguien recuerde correr el script manual.
// Un documento por instalación Y alcance ({instalacionId}_{ALCANCE}): el mapa pinta un
// marcador por documento y filtra por `tipo`, así que una instalación con PAA y SAE
// (p. ej. Climbat La Foixarda) necesita dos. Antes había uno solo por instalación
// ({instalacionId}) y el segundo alcance no salía al filtrar; ese documento se borra.
async function sincronizarCertificados(instalacionId) {
  if (!instalacionId) return;

  const snap = await db.collection("inspecciones")
    .where("instalacionId", "==", instalacionId)
    .where("estado", "==", "completada")
    .where("resultado", "==", "FAVORABLE")
    .get();

  // La más reciente de cada alcance
  const porAlcance = {};
  snap.forEach((doc) => {
    const d = doc.data();
    if (!d.fechaInspeccion) return;
    const alc = (d.tipoAlcance || "PAA").toUpperCase();
    if (!porAlcance[alc] || d.fechaInspeccion > porAlcance[alc].fechaInspeccion) porAlcance[alc] = d;
  });

  const col = db.collection("certificados-publicos");
  const quedan = new Set(Object.keys(porAlcance).map((a) => instalacionId + "_" + a));

  // Documentos de esta instalación que ya no corresponden: el antiguo sin sufijo y los
  // de alcances que hayan dejado de tener inspección favorable.
  const borrar = [col.doc(instalacionId)];
  const existentes = await col.where("instalacionId", "==", instalacionId).get();
  existentes.forEach((doc) => { if (!quedan.has(doc.id)) borrar.push(doc.ref); });
  for (const ref of borrar) await ref.delete().catch(() => {});

  const alcances = Object.keys(porAlcance);
  if (!alcances.length) return;

  const instSnap = await db.collection("instalaciones").doc(instalacionId).get();
  const inst = instSnap.exists ? instSnap.data() : {};
  const ref0 = porAlcance[alcances[0]];

  let lat = inst.lat || null;
  let lng = inst.lng || null;
  if (!lat || !lng) {
    const geo = await geocode(
      inst.direccion || ref0.direccion || "",
      inst.cp || ref0.cp || "",
      inst.localidad || ref0.localidad || "",
      inst.municipio || ref0.municipio || "",
      inst.provincia || ref0.provincia || ""
    );
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
      await db.collection("instalaciones").doc(instalacionId).update({ lat, lng }).catch(() => {});
    }
  }

  for (const alc of alcances) {
    const insp = porAlcance[alc];
    const lugar = [inst.municipio || insp.municipio, inst.provincia || insp.provincia]
      .filter((s) => s && !isBlank(s))
      .join(", ");
    await col.doc(instalacionId + "_" + alc).set({
      instalacionId: instalacionId,
      nombre: insp.nombreInstalacion || "",
      lugar: lugar,
      lat: lat,
      lng: lng,
      // Igual que "Fecha entrada en vigor" en el certificado (resultado.html, commit
      // f3369a8): el certificado se firma junto con el informe, la vigencia cuenta desde
      // fechaEmision, no desde la fecha de la visita. Fallback a fechaInspeccion para
      // inspecciones anteriores a este campo.
      fechaValidez: addYear(insp.fechaEmision || insp.fechaInspeccion),
      tipo: alc,
      actualizadoEn: FieldValue.serverTimestamp()
    });
  }
}

exports.sincronizarCertificados = sincronizarCertificados;

exports.syncCertificadoPublico = onDocumentWritten("inspecciones/{inspeccionId}", async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  const before = event.data.before.exists ? event.data.before.data() : null;
  const ids = new Set([after && after.instalacionId, before && before.instalacionId].filter(Boolean));
  for (const id of ids) await sincronizarCertificados(id);
});

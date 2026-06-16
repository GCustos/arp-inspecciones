const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "db-dump/instalaciones.json")));
const docs = Object.entries(data).map(([id, d]) => ({ id, ...d }));

const PENDIENTE = "__PENDIENTE__";
const isPendiente = v => !v || v === PENDIENTE;

// ── 1. Agrupar por código (duplicados de código) ──
const porCodigo = {};
docs.forEach(d => {
  const cod = d.codigo;
  if (!isPendiente(cod)) {
    if (!porCodigo[cod]) porCodigo[cod] = [];
    porCodigo[cod].push(d);
  }
});

const duplicadosCodigo = Object.entries(porCodigo)
  .filter(([, arr]) => arr.length > 1)
  .sort((a, b) => a[0].localeCompare(b[0]));

// ── 2. Sin código ──
const sinCodigo = docs.filter(d => isPendiente(d.codigo));

// ── 3. Todo pendiente (sin ningún dato útil) ──
const sinDatos = docs.filter(d =>
  isPendiente(d.codigo) &&
  isPendiente(d.municipio) &&
  isPendiente(d.propietario) &&
  isPendiente(d.direccion) &&
  isPendiente(d.ultimaInspeccion)
);

// ── 4. Última inspección muy antigua (antes de 2020) ──
const antiguos = docs.filter(d => {
  if (isPendiente(d.ultimaInspeccion)) return false;
  return d.ultimaInspeccion < "2020-01-01";
});

// ── Generar informe ──
let out = "";
const line = (s = "") => out += s + "\n";

line("═══════════════════════════════════════════════════");
line("  INFORME INSTALACIONES — " + new Date().toLocaleDateString("es-ES"));
line("═══════════════════════════════════════════════════");
line(`Total documentos: ${docs.length}`);
line(`Con código: ${docs.length - sinCodigo.length}`);
line(`Sin código: ${sinCodigo.length}`);
line(`Sin ningún dato útil: ${sinDatos.length}`);
line(`Última inspección anterior a 2020: ${antiguos.length}`);
line();

// ── SECCIÓN 1: Duplicados de código ──
line("───────────────────────────────────────────────────");
line(`  MISMO CÓDIGO — ${duplicadosCodigo.length} grupos`);
line("───────────────────────────────────────────────────");
duplicadosCodigo.forEach(([cod, arr]) => {
  line(`\n  [${cod}] — ${arr.length} documentos:`);
  arr.forEach(d => {
    const ultima = isPendiente(d.ultimaInspeccion) ? "sin fecha" : d.ultimaInspeccion;
    line(`    • ${d.id}`);
    line(`      Nombre: ${d.nombre || "–"}`);
    line(`      Última inspección: ${ultima}`);
  });
});

// ── SECCIÓN 2: Sin código ──
line("\n───────────────────────────────────────────────────");
line(`  SIN CÓDIGO — ${sinCodigo.length} documentos`);
line("───────────────────────────────────────────────────");
sinCodigo.forEach(d => {
  const ultima = isPendiente(d.ultimaInspeccion) ? "sin fecha" : d.ultimaInspeccion;
  line(`  • ${d.id} → "${d.nombre || "sin nombre"}" (última: ${ultima})`);
});

// ── SECCIÓN 3: Sin ningún dato ──
line("\n───────────────────────────────────────────────────");
line(`  SIN NINGÚN DATO ÚTIL — ${sinDatos.length} docs (candidatos a borrar)`);
line("───────────────────────────────────────────────────");
sinDatos.forEach(d => line(`  • ${d.id} → "${d.nombre || "sin nombre"}"`));

// ── SECCIÓN 4: Muy antiguos ──
line("\n───────────────────────────────────────────────────");
line(`  ÚLTIMA INSPECCIÓN ANTES DE 2020 — ${antiguos.length} docs`);
line("───────────────────────────────────────────────────");
antiguos.sort((a, b) => a.ultimaInspeccion.localeCompare(b.ultimaInspeccion));
antiguos.forEach(d => line(`  • ${d.ultimaInspeccion}  ${d.id} → "${d.nombre}"`));

line("\n═══════════════════════════════════════════════════");

const outFile = path.join(__dirname, "informe-instalaciones.txt");
fs.writeFileSync(outFile, out);
console.log(out);
console.log("Guardado en: " + outFile);

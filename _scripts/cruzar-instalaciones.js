const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "db-dump/instalaciones.json")));
const docs = Object.entries(data).map(([id, d]) => ({ id, ...d }));
const PENDIENTE = "__PENDIENTE__";
const isPendiente = v => !v || v === PENDIENTE;

// ── Normalización ──
const STOP = new Set(["de","la","el","los","las","en","del","y","san","santa","paa","sae"]);
function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // quitar acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOP.has(t));
}

docs.forEach(d => { d.tokens = new Set(normalize(d.nombre)); });

// ── Frecuencia global de cada token (para bajar peso a palabras genéricas tipo "aventura","park") ──
const freq = {};
docs.forEach(d => d.tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));

function score(a, b) {
  let s = 0;
  a.tokens.forEach(t => { if (b.tokens.has(t)) s += 1 / freq[t]; });
  return s;
}

// ── Separar "repesca" (última inspección <= 2020 o sin fecha Y sin código) ──
const esRepesca = d => {
  if (!isPendiente(d.ultimaInspeccion) && d.ultimaInspeccion <= "2020-12-31") return true;
  return false;
};
const repesca = docs.filter(esRepesca);
const activos = docs.filter(d => !esRepesca(d));

const sinCodigo = activos.filter(d => isPendiente(d.codigo));
const conCodigo = activos.filter(d => !isPendiente(d.codigo));

// ── Para cada doc sin código, buscar mejores candidatos (con código + sin código) ──
const UMBRAL = 0.5; // score mínimo para considerar candidato
const resultados = [];
const usados = new Set();

sinCodigo.forEach(d => {
  if (usados.has(d.id)) return;
  const candidatos = activos
    .filter(o => o.id !== d.id && !usados.has(o.id))
    .map(o => ({ doc: o, score: score(d, o) }))
    .filter(c => c.score >= UMBRAL)
    .sort((a, b) => b.score - a.score);
  if (candidatos.length) {
    resultados.push({ base: d, candidatos });
    usados.add(d.id);
    candidatos.forEach(c => usados.add(c.doc.id));
  }
});

const sinMatch = sinCodigo.filter(d => !usados.has(d.id) || !resultados.find(r => r.base.id === d.id || r.candidatos.some(c => c.doc.id === d.id)));

// ── Informe ──
let out = "";
const line = (s = "") => out += s + "\n";

line("═══════════════════════════════════════════════════");
line("  CRUCE SIN-CÓDIGO vs RESTO — " + new Date().toLocaleDateString("es-ES"));
line("═══════════════════════════════════════════════════");
line(`Total activos (excluyendo repesca): ${activos.length}`);
line(`Repesca (≤2020): ${repesca.length}`);
line(`Sin código (activos): ${sinCodigo.length}`);
line(`Grupos de posible coincidencia encontrados: ${resultados.length}`);
line();

line("───────────────────────────────────────────────────");
line("  POSIBLES COINCIDENCIAS (revisar y confirmar)");
line("───────────────────────────────────────────────────");
resultados
  .sort((a, b) => b.candidatos[0].score - a.candidatos[0].score)
  .forEach(r => {
    line(`\n  ¿Es lo mismo que...?`);
    line(`    [BASE sin código] ${r.base.id} → "${r.base.nombre}" (última: ${r.base.ultimaInspeccion === PENDIENTE ? "sin fecha" : r.base.ultimaInspeccion})`);
    r.candidatos.forEach(c => {
      const cod = isPendiente(c.doc.codigo) ? "sin código" : c.doc.codigo;
      line(`    [${cod}] ${c.doc.id} → "${c.doc.nombre}" (última: ${c.doc.ultimaInspeccion === PENDIENTE ? "sin fecha" : c.doc.ultimaInspeccion}) — score ${c.score.toFixed(2)}`);
    });
  });

line("\n───────────────────────────────────────────────────");
line(`  SIN CANDIDATO CLARO — ${sinMatch.length} docs (revisar manualmente o esperar más datos)`);
line("───────────────────────────────────────────────────");
sinMatch.forEach(d => line(`  • ${d.id} → "${d.nombre}" (última: ${d.ultimaInspeccion === PENDIENTE ? "sin fecha" : d.ultimaInspeccion})`));

line("\n───────────────────────────────────────────────────");
line(`  REPESCA — ${repesca.length} docs con última inspección ≤ 2020 (aparte, no tocar ahora)`);
line("───────────────────────────────────────────────────");
repesca.sort((a,b) => (a.ultimaInspeccion||"").localeCompare(b.ultimaInspeccion||""));
repesca.forEach(d => {
  const cod = isPendiente(d.codigo) ? "sin código" : d.codigo;
  line(`  • [${cod}] ${d.ultimaInspeccion}  ${d.id} → "${d.nombre}"`);
});

line("\n═══════════════════════════════════════════════════");

fs.writeFileSync(path.join(__dirname, "informe-cruce.txt"), out);
console.log(out);
console.log("\nGuardado en: _scripts/informe-cruce.txt");

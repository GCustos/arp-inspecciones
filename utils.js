// ── ARP Inspecciones — utilidades compartidas ──
// Cargar después de los scripts de Firebase y antes del script inline de cada página.

/**
 * Escapa caracteres HTML especiales. Versión canónica con String() cast.
 */
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Iniciales de un nombre (hasta 2 letras, mayúsculas) para avatares/badges.
 * fallback: qué devolver si no hay nombre — por defecto '?'.
 */
function computeIniciales(nombre, fallback) {
  fallback = fallback || '?';
  if (!nombre) return fallback;
  var p = String(nombre).trim().split(/\s+/).filter(Boolean);
  if (!p.length) return fallback;
  var ini = ((p[0][0]||'') + (p[1]&&p[1][0]||'')).toUpperCase();
  return ini || nombre.slice(0,2).toUpperCase() || fallback;
}

/**
 * Muestra un toast de notificación breve (2,5 s).
 * Requiere <div id="toast"> en el DOM con clase CSS .show para visibilidad.
 */
function showToast(msg, ms) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, ms || 2500);
}

/**
 * Convierte fecha ISO YYYY-MM-DD a DD/MM/YYYY.
 * Devuelve la cadena original si no coincide el patrón.
 */
function fmtFecha(str) {
  if (!str) return '';
  var m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return m[3] + '/' + m[2] + '/' + m[1];
  return str;
}

/**
 * Convierte una cadena a slug: minúsculas, sin acentos, espacios → guión bajo.
 */
function slugify(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Inicializa autenticación Firebase en páginas secundarias (todas excepto index.html).
 * Verifica activo + rol en Firestore, gestiona fallback offline, y llama onReady.
 *
 * @param {object} opts
 *   roles        {string[]|null}          Roles permitidos. null = cualquier usuario activo.
 *   onReady      {function(user, ud)}     user = Firebase Auth obj, ud = datos Firestore.
 *   onDenied     {'redirect'|'message'|function}  Qué hacer si acceso denegado. Default: 'redirect'.
 *   offline      {boolean}                Habilitar fallback localStorage. Default: false.
 *   offlineTimeout {number}              ms antes de usar el fallback. Default: 3000.
 */
function initAuth(opts) {
  var roles          = opts.roles || null;
  var onReady        = opts.onReady;
  var onDenied       = opts.onDenied || 'redirect';
  var offline        = opts.offline === true;
  var timeout        = opts.offlineTimeout || 3000;
  var done           = false;

  function deny() {
    if (typeof onDenied === 'function') {
      onDenied();
    } else if (onDenied === 'message') {
      var el = document.getElementById('content');
      if (el) el.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 20px">Acceso restringido.</p>';
    } else {
      location.href = 'index.html';
    }
  }

  function proceed(user, ud) {
    if (done) return;
    done = true;
    if (!ud || !ud.activo) { deny(); return; }
    if (roles && roles.indexOf(ud.rol) === -1) { deny(); return; }
    try { localStorage.setItem('arpUser_' + user.email, JSON.stringify(ud)); } catch(e) {}
    onReady(user, ud);
  }

  if (offline) {
    setTimeout(function() {
      if (done) return;
      var keys = Object.keys(localStorage).filter(function(k) { return k.startsWith('arpUser_'); });
      if (keys.length) {
        var email = keys[0].replace('arpUser_', '');
        try {
          var ud = JSON.parse(localStorage.getItem(keys[0]) || '{}');
          proceed({ email: email, photoURL: '', displayName: ud.nombre || email }, ud);
        } catch(e) { location.href = 'index.html'; }
      } else {
        location.href = 'index.html';
      }
    }, timeout);
  }

  auth.onAuthStateChanged(function(user) {
    if (!user) { location.href = 'index.html'; return; }
    db.collection('usuarios').doc(user.email).get().then(function(snap) {
      if (!snap.exists) { deny(); return; }
      proceed(user, snap.data());
    }).catch(function(e) {
      if (offline) {
        var saved = localStorage.getItem('arpUser_' + user.email);
        if (saved) {
          try { proceed(user, JSON.parse(saved)); return; } catch(e2) {}
        }
      }
      location.href = 'index.html';
    });
  });
}

/**
 * Carga usuarios activos con capacidad de inspección (excluye roles 'oficina'/'contabilidad').
 * Requiere que `db` (Firestore) esté disponible como global.
 * @param {function(Array)} onSuccess - Recibe [{email, nombre, rol, ...}]
 * @param {function(Error)} [onError]  - Callback opcional de error
 */
function cargarInspectores(onSuccess, onError) {
  db.collection('usuarios').get().then(function(snap) {
    var lista = [];
    snap.forEach(function(d) {
      var u = d.data();
      if (u.activo && u.rol !== 'oficina' && u.rol !== 'contabilidad') lista.push(Object.assign({ email: d.id }, u));
    });
    onSuccess(lista);
  }).catch(function(e) {
    if (onError) onError(e);
  });
}

/**
 * sesiones de una inspección como array ordenado [{fecha, horaInicio, horaFin}].
 * Admite el formato antiguo (array) y el nuevo (mapa {fecha:{horaInicio,horaFin}}).
 * Misma lógica que la copia local de inspeccion.html (que la sobrescribe con idéntico efecto).
 */
function sesionesArrayFrom(sesiones) {
  if (!sesiones) return [];
  if (Array.isArray(sesiones)) return sesiones;
  return Object.keys(sesiones).map(function(f) { return Object.assign({ fecha: f }, sesiones[f]); })
    .sort(function(a, b) { return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0; });
}

/** Fecha de hoy en hora local, AAAA-MM-DD (toISOString da la de UTC: de 00:00 a 01:00/02:00
 *  en España devolvía el día anterior). */
function hoyLocalISO(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/**
 * Herencia de circuitos para la inspección del año siguiente: misma instalación y MISMO
 * alcance. Antes se copiaban los de la última inspección completada de la instalación fuera
 * del alcance que fuera (una PAA de TopJump Sagunto habría recibido las vías de su SAE) y
 * sin el tipo de elemento (Vía/Muro/Tramo).
 *
 * plantillaCircuitos(circuitos): solo la estructura (circuitos con nombre y tipo de elemento;
 *   juegos con nombre, tipo y rama), sin respuestas, fotos ni ids. Se guarda al completar en
 *   instalaciones/{id}.plantillaCircuitos.{ALCANCE}: las instalaciones las lee cualquier
 *   usuario, la inspección anterior no (un inspector solo lee las suyas).
 * circuitosDesdePlantilla(plantilla, nuevoId): circuitos nuevos (mapa {id: circuito}, juegos
 *   como mapa {id: juego}, el formato que escribe inspeccion.html) con todo en blanco.
 * buscarPlantillaCircuitos(db, instalacionId, alcance): Promise → plantilla o null. Primero la
 *   de la instalación; si no la tiene aún (inspecciones completadas antes de este cambio), la
 *   saca de la última inspección completada de esa instalación y alcance, si se puede leer.
 */
function _ordenados(v) {
  var arr = Array.isArray(v) ? v : Object.keys(v || {}).map(function(k) { var x = v[k]; if (x && !x.id) x.id = k; return x; });
  return arr.slice().sort(function(a, b) { return (a.orden || 0) - (b.orden || 0); });
}
function plantillaCircuitos(circuitos) {
  return _ordenados(circuitos).map(function(c) {
    var p = { nombre: c.nombre || '', juegos: _ordenados(c.juegos).map(function(j) {
      return { nombre: j.nombre || '', tipo: j.tipo || 'R', rama: j.rama || '' };
    }) };
    if (c.tipoElemento) p.tipoElemento = c.tipoElemento;
    return p;
  });
}
function circuitosDesdePlantilla(plantilla, nuevoId) {
  var map = {};
  (plantilla || []).forEach(function(c, ci) {
    var cId = nuevoId(), juegos = {};
    (c.juegos || []).forEach(function(j, ji) {
      var jId = nuevoId();
      juegos[jId] = { id: jId, orden: ji, nombre: j.nombre || '', tipo: j.tipo || 'R', rama: j.rama || '', obs: '', fotos: [] };
    });
    map[cId] = { id: cId, nombre: c.nombre || '', orden: ci, juegos: juegos };
    if (c.tipoElemento) map[cId].tipoElemento = c.tipoElemento;
  });
  return map;
}
function buscarPlantillaCircuitos(db, instalacionId, alcance) {
  if (!instalacionId || !alcance) return Promise.resolve(null);
  return db.collection('instalaciones').doc(instalacionId).get().then(function(snap) {
    var pl = snap.exists && snap.data().plantillaCircuitos && snap.data().plantillaCircuitos[alcance];
    if (pl && pl.length) return pl;
    return db.collection('inspecciones').where('instalacionId', '==', instalacionId).get().then(function(q) {
      var mejor = null;
      q.forEach(function(d) {
        var x = d.data();
        if (x.estado !== 'completada' || (x.tipoAlcance || 'PAA') !== alcance) return;
        var k = (x.fechaInspeccion || '') + '|' + (x.fechaCompletadaLocal || '');
        if (!mejor || k > mejor.k) mejor = { k: k, x: x };
      });
      var p = mejor ? plantillaCircuitos(mejor.x.circuitos) : [];
      return p.length ? p : null;
    });
  }).catch(function(e) { console.warn('Herencia de circuitos:', e.message); return null; });
}

/**
 * Lista de revisiones de una inspección, de la Rev.0 a la actual, con quién hizo cada una.
 * Las revisiones cerradas salen de historialRevisiones (copia guardada al reabrir); la última
 * es el propio documento. Copias anteriores a 2026-10 no guardaban el inspector → sinDato.
 *   fecha:  Rev.0 = fechaInspeccion; Rev.N = primera sesión real (con hora) de esa revisión.
 *   motivo: '' en Rev.0; 'revisita' | 'correccion' en Rev.N ('' = sin dato).
 *   cuenta: si vale como inspección para la formación continua (PFO.01): Rev.0 completada,
 *           o Rev.N completada con motivo 'revisita'. Nunca si falta el inspector.
 */
function revisionesInspeccion(insp) {
  function fechaRev(rev, sesiones) {
    if (!rev) return insp.fechaInspeccion || '';
    var ses = sesionesArrayFrom(sesiones);
    var real = ses.filter(function(s) { return s.horaInicio || s.horaFin; });
    return (real[0] || ses[0] || {}).fecha || '';
  }
  function item(src, cerrada) {
    var rev = src.revision || 0;
    var r = {
      revision: rev,
      inspectorEmail: src.inspectorEmail || '', inspectorNombre: src.inspectorNombre || '',
      inspector2Email: src.inspector2Email || '', inspector2Nombre: src.inspector2Nombre || '',
      motivo: rev ? (src.motivoRevision || '') : '',
      resultado: src.resultado || '',
      fecha: fechaRev(rev, src.sesiones),
      cerrada: cerrada,
      sinDato: !src.inspectorEmail
    };
    r.cuenta = r.cerrada && !r.sinDato && (rev === 0 || r.motivo === 'revisita');
    return r;
  }
  var out = (insp.historialRevisiones || []).map(function(h) { return item(h, true); });
  out.push(item(insp, insp.estado === 'completada'));
  return out;
}

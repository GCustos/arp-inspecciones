// ── ARP Inspecciones — utilidades compartidas ──
// Cargar después de los scripts de Firebase y antes del script inline de cada página.

/**
 * Escapa caracteres HTML especiales. Versión canónica con String() cast.
 */
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Muestra un toast de notificación breve (2,5 s).
 * Requiere <div id="toast"> en el DOM con clase CSS .show para visibilidad.
 */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2500);
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
 * Carga usuarios activos con capacidad de inspección (excluye rol 'oficina').
 * Requiere que `db` (Firestore) esté disponible como global.
 * @param {function(Array)} onSuccess - Recibe [{email, nombre, rol, ...}]
 * @param {function(Error)} [onError]  - Callback opcional de error
 */
function cargarInspectores(onSuccess, onError) {
  db.collection('usuarios').get().then(function(snap) {
    var lista = [];
    snap.forEach(function(d) {
      var u = d.data();
      if (u.activo && u.rol !== 'oficina') lista.push(Object.assign({ email: d.id }, u));
    });
    onSuccess(lista);
  }).catch(function(e) {
    if (onError) onError(e);
  });
}

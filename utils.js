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

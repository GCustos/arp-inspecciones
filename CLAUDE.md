# ARP Inspecciones — notas para Claude Code

App web de inspecciones de ARP Prevención (parques de aventura PAA, escalada SAE, vías ferratas FER). HTML + JS sin build, Firebase (Auth, Firestore, Storage) y PDFs con jsPDF. El usuario trabaja desde dos ordenadores (oficina y casa) y habla en español: responde en español.

## Forma de trabajar con el usuario

- **Pregunta antes de cada `git push`** (y antes de escribir o borrar datos en Firestore): enseña qué se va a cambiar y espera el "sí".
- Al empezar en otro ordenador: `git pull`. Al terminar: todo commiteado y subido.
- Commits en español con prefijo (`fix(...)`, `feat(...)`), explicando el porqué. En PowerShell 5.1 los here-strings rompen `git commit -F -`: escribir el mensaje en un archivo temporal y usar `git commit -F <archivo>`.
- Antes de decir que un cambio del PDF "funciona", generarlo de verdad (ver «Probar sin navegador»). No dar por bueno algo solo porque compila.

## Regla de oro: no duplicar código

Si una funcionalidad ya existe en algún sitio (dibujo, cálculo, validación), se **llama**
(con los parámetros que cambien) en vez de escribir una copia nueva, aunque sea "solo
para esta pantalla". Es la única forma de que un cambio se propague a todos los sitios
que deberían comportarse igual, sin depender de que alguien recuerde tocar el otro sitio
también.

## Despliegue

- La app se sirve desde **GitHub Pages** (rama `main`): un `git push` ya la publica en 1–2 minutos. `firebase deploy` solo hace falta para `firestore.rules`, `storage.rules` o `functions/`.
- **Service worker (`sw.js`)**: páginas y ficheros propios (js/css/img) van *network-first* (caché solo sin conexión); las librerías externas (Firebase, jsPDF…) *cache-first*.
  - Al cambiar cualquier fichero de la app, sube `CACHE_NAME` (`arp-vX.YY`).
  - Si una página nueva depende de funciones nuevas de un `.js` compartido, cambia también su query en el `<script>` (p. ej. `plantilla-informe.js?v=2`). Si no, un navegador con el SW anterior mezcla HTML nuevo con `.js` viejo ("X is not a function").

## Datos y scripts de administración

- La clave Admin SDK (`*adminsdk*.json`) está en la raíz, **ignorada por git**; nunca se sube ni se comparte. Existe en los dos ordenadores.
- Comandos de Firebase CLI (`firebase deploy`, `functions:list`...): usar siempre una cuenta propia de este proyecto, pasada explícita con `--account <email> --project arp-inspecciones` — nunca depender del proyecto "activo por defecto" de la CLI, sobre todo si la máquina gestiona más de un proyecto Firebase. El email de la cuenta vive en `CLAUDE.privado.md` (no en git).
- No desplegar cambios a páginas en uso activo por un inspector en campo (`inspeccion.html`, `nueva-inspeccion.html`, `resultado.html`, `sw.js`) sin confirmar antes que ha terminado su jornada — diagnosticar y preparar el fix sí, el commit/deploy espera.
- Para consultar o corregir Firestore: scripts Node con `firebase-admin` (API modular: `firebase-admin/app` y `firebase-admin/firestore`) **fuera del repo** (scratchpad o `_scripts/`, que está en `.gitignore`).
- Escrituras: comprobar antes que los datos están como se espera (si no, parar sin escribir), guardar copia local de lo que se toca, usar `batch` y releer después para verificarlo.
- La base de datos tiene muchas instalaciones duplicadas importadas sin datos (`__PENDIENTE__`). Al dar de alta un cliente: buscar duplicadas, quedarse con la de inspección más reciente y pasar los nombres de las demás a `aliases`.

## Informe PDF, revisiones y ENAC

- `resultado.html` dibuja el informe. Los **textos fijos** y la **estructura** del informe están en `plantilla-informe.js` (fuente única; también `estructura()`, `diffBloques()`, `diffPalabras()`).
- Revisión del formato del informe: `config/{paa|sae|fer}.formatoRevision/formatoFecha`; registro: `registroRevision/registroFecha`. Cada revisión publicada tiene su entrada en `config/{alc}/historial/{rev}` con `motivo`, checklist, columnas y **`plantilla`** (copia de la estructura del informe).
- Si cambias un texto o el orden de una sección del informe, actualiza `estructura()` para que lo refleje. Formatos avisa de que el informe cambió sin revisión y permite publicar una «revisión solo de texto».
- **Ajustes de maquetación dentro de la misma revisión** (p. ej. evitar un salto de página feo) **no suben revisión**: lo pidió el usuario.
- Historial de documentos / Formatos:
  - «↕ Cambios» → `resultado.html?comparar=1&alc=&de=&a=`: informe completo con los cambios marcados (azul = añadido o movido, rojo tachado = eliminado). Solo si la revisión `a` es la plantilla actual.
  - «PDF» en la revisión vigente → plantilla completa (`de=a`).
  - `comparar-informe.html`: comparativa en pantalla.
- Al **completar** una inspección se guarda `fechaEmision` (va junto a la firma; la visita va en la portada) y se fija la revisión de formato vigente si checklist y columnas no cambiaron desde que se creó. Una Rev 1 de un informe se emite con el modelo vigente ese día.
- Los informes emitidos se firman y se archivan fuera de la app (enlace al cliente); no hace falta guardar el PDF en la app.
- Lista de documentos ENAC: `admin-documentos.html` sobre `config/listaDocumentos` (cada cambio deja historial). Las filas de plantillas de informe, fichas de registro y certificados están vinculadas a la revisión de la app y avisan si van por detrás.

## Probar sin navegador

Para comprobar PDFs y páginas de verdad: `puppeteer-core` con el Edge instalado (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`), abriendo `https://gcustos.github.io/arp-inspecciones/...` pero respondiendo con los ficheros locales (interceptando peticiones), sustituyendo `firebase-app.js` por un stub con datos reales leídos en solo lectura con `firebase-admin`, y bloqueando `sw.js`. Descargar el PDF con `Browser.setDownloadBehavior` y revisarlo con `pypdfium2` (texto y render a PNG).

## Reloj

Si Firebase devuelve `UNAUTHENTICATED` con la clave Admin, revisa la hora de Windows (una vez estaba 3 días atrasada): Configuración → Hora → «Sincronizar ahora».

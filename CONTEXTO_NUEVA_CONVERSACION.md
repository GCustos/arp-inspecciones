# CONTEXTO ARP INSPECCIONES — Para nueva conversación
_Generado: Junio 2026_

---

## PROYECTO

**App:** ARP Inspecciones PWA — sistema de gestión de inspecciones ENAC para Adell Riesgos y Prevención S.L.  
**Repo:** github.com/GCustos/arp-inspecciones  
**App URL:** gcustos.github.io/arp-inspecciones  
**Stack:** HTML/CSS/JS puro · Firebase v8 compat (classic scripts) · GitHub Pages · jsPDF cliente · Service Worker offline-first  
**Firebase proyecto:** `arp-inspecciones` · Plan Blaze activo · Storage EU Multi-Regional activo  

---

## EMPRESA ARP

- **Nombre:** Adell Riesgos y Prevención S.L. · CIF: B64399793
- **Sede Social:** C/ Gabriel Miró 3, Edificio Wertice, Planta 1ª Puerta 4, 41704 Dos Hermanas, Sevilla
- **Sede Fiscal:** Calle Collblanc, nº 150, 08028 Barcelona
- **ENAC:** Nº 489 / EI 558 · Tel: 93 377 67 95 · info@arpprevencion.com
- **Web:** www.arpprevencion.com

---

## FIREBASE CONFIG

```javascript
apiKey: "AIzaSyDncKj2_RBJWgzzjOn2079x47pf_ycGFlc"
authDomain: "arp-inspecciones.firebaseapp.com"
projectId: "arp-inspecciones"
storageBucket: "arp-inspecciones.firebasestorage.app"
messagingSenderId: "35880168451"
appId: "1:35880168451:web:090e3c250b4416ed0b3236"
```

---

## USUARIOS DEL SISTEMA

| Email | Nombre | Rol | Sede | Notas |
|---|---|---|---|---|
| guimarcon.arp@gmail.com | Guillermo J. Marco Contreras (GM) | admin | SEVILLA | Cuenta Google para la app |
| __PENDIENTE_JM__ | José Manuel Moreno Vélez (JM) | director | SEVILLA | Firma todos los informes ENAC |
| __PENDIENTE_CG__ | Cristian Guerrero (CG) | inspector | GRANADA | |
| __PENDIENTE__ | Mario Adell | inspector | Nacional | Sin sello ENAC, no aparece en FSG.02 |
| __PENDIENTE__ | David (DR) | inspector | ¿? | |
| __PENDIENTE__ | Marc | inspector | CATALUÑA | |
| __PENDIENTE__ | David (Cataluña) | inspector | CATALUÑA | |

---

## ESTADO FIRESTORE

Colecciones activas:
- `config/empresa` — datos ARP
- `config/paa` — formato documento Rev.9 (26/02/2026), tipos NC, equipos requeridos
- `equipos` — 35 equipos activos cargados
- `instalaciones` — 378 instalaciones únicas cargadas (198 con codigo `__PENDIENTE__`)
- `usuarios` — GM cargado y correcto. Resto pendientes de email
- `inspecciones` — inspecciones reales (pruebas borradas)

Colecciones pendientes de crear:
- `clientes` — propietarios de instalaciones
- `gestores` — gestores/explotadores

---

## ARCHIVOS Y DRIVE IDs

| Archivo | Drive ID | Estado |
|---|---|---|
| index.html | 1QXv1EF6wA5u1M8RTq1KtMH16rhutt38Q | ✅ Actualizado |
| inspeccion.html | 1kRLhiRFhtwe1wS_w2Hk_rKC8H8MURYyw | ✅ Con Storage |
| inspecciones.html | 1-TFq8_C-1eRAo3KsjQlHaSQ2S4oglM-U | ✅ Fix offline |
| nueva-inspeccion.html | 1jezaTMDD_Ek_QrVS8r35zc4sYFFWDtwg | ⚠️ Pendiente actualizar |
| resultado.html | 1o5GeIKOc1HJ5VR7aY66JJLOW124UNlXj | ✅ PDFs completos |
| sw.js | 1CVxtpbHPvbNZGhrX3iPzZYxgRSh_RZFi | ✅ v1.5 |

**Patrón de trabajo con Drive:** Claude lee via `Google Drive:download_file_content`, genera correcciones como output, Guille descarga y sube manualmente (Drive MCP no puede sobreescribir archivos existentes).

---

## ESTADO DE ARCHIVOS

### `index.html`
- Login Google con `signInWithRedirect` móvil / `signInWithPopup` desktop
- Pantalla principal con módulos (solo Inspecciones activo)
- Tarjeta datos empresa — al pulsar abre modal pantalla completa con texto grande + Copiar + Compartir
- Fallback offline con localStorage

### `inspeccion.html` ✅ MÁS RECIENTE
- Firebase Storage integrado — fotos suben a Storage, fallback base64 offline
- `sincronizarFotosPendientes()` al recuperar conexión
- `sanitizar()` recursivo antes de guardar en Firestore
- `comprimirImagen()` — 1200px / 72% JPEG
- Autoguardado cada 30s con badge verde
- 5 niveles NC: GRAVE🔴 MEDIA🟡 LEVE🟢 DOCUMENTAL🔵 OBSERVACIÓN⚪
- Solo OBSERVACION no bloquea certificado (DOCUMENTAL sí bloquea)
- Botón cancelar NC — revierte criterio al valor anterior
- Foto en modal NC — aparece al seleccionar gravedad (opción C: modal + tarjeta)
- Renombrar circuito — icono ✏️ en cabecera de cada circuito
- "Fin circuito →" / "Siguiente →" navegación

### `inspecciones.html`
- Fallback offline: si `onAuthStateChanged` tarda >3s usa localStorage
- Banner "Sin conexión" visible
- Lista en curso / completadas con "Ver más"

### `resultado.html`
- Lee de Firestore con fallback a localStorage (triple backup)
- Genera 3 PDFs offline desde memoria:
  1. **Informe** — formato Harriartean completo (portada, índice, datos, metodología, mantenimiento, resultados, fotos por circuito, checklist, NCs con fotos, características, firma)
  2. **Certificado** — solo si FAVORABLE
  3. **Registro ENAC** — 3 páginas internas
- Bug fix: `const { jsPDF }` movido dentro de funciones (no top-level)
- Timeout 4s con mensaje error en lugar de spinner eterno

### `sw.js` v1.5
- Cachea páginas + Firebase SDK + Storage SDK + jsPDF
- No intercepta Firestore ni Storage (tienen su propio offline)
- `skipWaiting()` + `clients.claim()` — actualización inmediata

---

## LÓGICA DE NEGOCIO CONFIRMADA

**Resultado inspección:**
- FAVORABLE = 0 NCs GRAVE/MEDIA/LEVE/DOCUMENTAL (puede tener OBSERVACION)
- DESFAVORABLE = cualquier NC GRAVE/MEDIA/LEVE/DOCUMENTAL

**Numeración registros:** `BVM/PAA/260520/Rev0`
- 3 letras instalación / tipo / AAMMDD primera sesión / revisión

**Formato documento:** Rev.9 · 26/02/2026 — guardado en inspección al completar (inmutable para trazabilidad ENAC)

**PDFs generan offline** desde estado en memoria + localStorage, sin necesitar Firestore

**Triple backup:**
1. Firestore persistence (IndexedDB)
2. localStorage JSON snapshot al completar
3. PDF descargado al dispositivo

**Fotos:**
- Se comprimen a 1200px/72% antes de guardar
- Suben a Firebase Storage cuando hay conexión
- Offline: se guardan como base64 con `pendiente:true`, suben al reconectar
- Estructura Storage: `inspecciones/{id}/general/`, `juegos/{ci}_{ji}/`, `ncs/{ni}/`

**Rev.1 workflow:**
- Inspector auxiliar cierra NCs (foto corrección)
- JM aprueba y firma desde oficina
- Mismo formato documento que Rev.0 original (trazabilidad ENAC)

---

## PENDIENTE INMEDIATO

- [ ] Prueba inspección real de punta a punta
- [ ] Emails de JM, CG, Mario, David, Marc, David Cataluña
- [ ] Validar PDF informe tras prueba real
- [ ] `nueva-inspeccion.html` — selector instalación, checklist equipos, nRegistro automático

## PENDIENTE MEDIO PLAZO

- [ ] Códigos 3 letras de 198 instalaciones (campo `codigo: "__PENDIENTE__"`)
- [ ] Propietario, gestor, dirección de cada instalación
- [ ] Colección `clientes` y `gestores`
- [ ] Firmas escaneadas de inspectores (Storage `firmas/`)
- [ ] Panel admin (`admin.html`)
- [ ] Flujo Rev.1 completo en la app
- [ ] Módulo equipos con estados y transferencias
- [ ] `nueva-inspeccion.html` mejorado con checklist equipos

## PENDIENTE LARGO PLAZO

- [ ] Módulo instalaciones
- [ ] Módulo inspectores + formaciones PAI
- [ ] Módulo ofertas
- [ ] Portal calidad pública
- [ ] Web formacionaventura.com
- [ ] SaaS multi-cliente (2027)

---

## PRINCIPIOS TÉCNICOS

- **Firebase v8 compat** sobre v9 modular — v9 ES modules fallan en Chrome móvil desde SW cache
- **Service Worker `no-cors`** para cachear Firebase scripts correctamente
- **PDF genera offline** desde `S` (estado en memoria) + localStorage, nunca relee Firestore
- **`sanitizar()`** recursivo elimina undefined antes de enviar a Firestore
- **Resolver diseño antes de codificar** — decisiones cerradas antes de escribir código
- **Versión SW** se actualiza en cada deploy para forzar actualización en móvil
- **Drive MCP** falla a veces con archivos HTML — fallback: Guille sube el archivo en el chat

---

## CONTEXTO COMERCIAL

- Informático externo tenía app sin offline, PDF descuadrado, NDA sin firmar
- Objetivo SaaS: silo Firebase por cliente, GitHub Pages, primer cliente externo 2027
- Mario Adell: co-fundador, parte proyectos, puede usar app pero sin sello ENAC ni FSG.02

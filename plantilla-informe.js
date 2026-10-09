// ═══════════════════════════════════════════════════════════════════════════════════
// PLANTILLA DEL INFORME DE INSPECCIÓN — contenido fijo (textos y estructura)
//
// Fuente única de los textos fijos del informe PDF. La usan:
//   · resultado.html, que dibuja el PDF;
//   · admin-formatos.html, que guarda una copia de la plantilla en cada revisión publicada
//     (config/{alcance}/historial/{rev}.plantilla) y avisa si el informe ha cambiado sin
//     publicar revisión;
//   · comparar-informe.html, que compara dos revisiones para ENAC.
//
// Si cambias aquí un texto, o en resultado.html el orden de una sección o un título fijo,
// actualiza también estructura() para que lo refleje: es lo que se compara entre revisiones.
// ═══════════════════════════════════════════════════════════════════════════════════
(function (root) {
'use strict';

  // ── TEXTO FIJO PAA ──
  const TEXTO_METODOLOGIA_1 = `Los Recorridos Acrobáticos en Altura (Parques de Aventura) son espacios de actividad lúdica asegurada que permiten al usuario recorrer distancias en altura por una estructura artificial, de manera más o menos acrobática. La seguridad del practicante está asegurada sea por medio de un equipo de protección individual (EPI) ligado a un dispositivo anticaídas, sea por un dispositivo de protección colectiva.

ARP PREVENCIÓN interviene en el cuadro de las exigencias normativas que se aplican a los explotadores o responsables de la gestión de los recorridos acrobáticos en altura (parques de aventura).

La norma impone:
— Una inspección previa a la apertura del parque y de toda modificación ulterior.
— Una inspección anual de los parques de aventura para verificar el estado y para determinar las acciones de puesta en conformidad que deben ser realizadas.

El diagnóstico visual realizado por ARP PREVENCIÓN consiste en medir la diferencia entre el nivel de seguridad exigido por la normativa y el nivel real de seguridad constatado sobre los equipos in situ.

Nota: Para esta actividad de control ARP PREVENCIÓN interviene de manera totalmente externa, siendo de este modo conforme a los criterios de independencia de los organismos que proceden a la inspección de tipo C tal como están definidos en el Anexo A de la norma UNE EN ISO/CEI 17 020 de junio 2012. Además, ARP PREVENCIÓN dispone de un seguro de responsabilidad civil específico.`;

  // ── TEXTO FIJO SAE (Estructuras Artificiales de Escalada) ──
  // Tomado literal del informe SAE antiguo de ARP (Informe XXX/SAE/XXXXX Rev.X, pág. 4).
  const TEXTO_METODOLOGIA_1_SAE = `El término estructura artificial de escalada (SAE) designa un equipamiento deportivo constituido por una estructura de escalada construida a tal efecto, presentando distintas características de construcción, y concebida con objetivos de utilización específicos y no reservada a conjuntos de personas particularmente preparados.

Según la demanda, el control realizado por ADELL RIESGOS Y PREVENCIÓN, S.L. (ARP) puede consistir en una simple inspección visual de los equipamientos, o en una inspección visual y una prueba estática (pruebas de carga).

ARP PREVENCIÓN interviene en el cuadro de las exigencias normativas que se aplican a los explotadores o responsables de la gestión de los equipamientos.

La norma impone:
— Una inspección previa a la apertura del equipamiento y de toda modificación ulterior.
— Una inspección periódica de las instalaciones para verificar el estado y para determinar las acciones de puesta en conformidad que deben ser realizadas.

El diagnóstico visual realizado por ARP consiste en medir la diferencia entre el nivel de seguridad exigido por la normativa y el nivel real de seguridad constatado sobre los equipos in situ.

Nota.- Para esta actividad de control ARP interviene de manera totalmente externa, siendo de este modo conforme a los criterios de independencia de los organismos que proceden a la inspección de tipo C tal como están definidos en el Anexo A de la norma UNE EN ISO/CEI 17 020 de junio 2012. Además ARP PREVENCIÓN dispone de un seguro de responsabilidad civil específico.`;

  const TEXTO_METODOLOGIA_2_SAE = `Para esta prestación el inspector de ARP PREVENCIÓN dispone del material siguiente:
— un aparato de fotografiar,
— una llave dinamométrica,
— un sistema medidor de la inclinación de pendientes,
— un sistema de medida de cargas (Dinamómetro) y cargas,
— un juego de sondas: dedo grande y pequeño, A, B, C, E, L, D, V, atraparopa,
— sondas de radio de redondeo,
— cronómetro,
— juego de pesas controladas,
— flexómetro,
— aparato de tracción,
— cualquier equipo específico necesario para la inspección.`;

  const TEXTO_METODOLOGIA_2 = `Para esta prestación el técnico de ARP PREVENCIÓN dispone del material EPI siguiente:
— Un arnés, un disipador de energía de caída, una polea, una cinta corta
— Dos mosquetones automáticos, dos mosquetones de doble seguridad, anilla de sujeción
— Un dispositivo de descenso, un dispositivo de ascenso
— Una cinta de 60 cm, 1,20 cm y cuerdas

El inspector de ARP PREVENCIÓN dispone además del material siguiente:
— un aparato de fotografiar numérico
— una llave dinamométrica
— un calibre para medir diámetros de cables (pie de rey)
— un sistema medidor de la inclinación de pendientes, si fuera necesario.`;

  const TEXTO_MANT_GENERAL = `Si la instalación no es segura, es conveniente impedir a los usuarios acceder a ella (ejemplos: la seguridad de la instalación no es total; el mantenimiento no puede garantizar un nivel exigible de seguridad…). Igualmente conviene poner remedio inmediatamente a los graves deterioros que se producen y que pueden arriesgar o amenazar la seguridad.`;

  const TEXTO_MANT_ORG = `Es conveniente que el mantenimiento y el control de las instalaciones y de sus componentes sean efectuadas de acuerdo a una frecuencia mínima. Para estos controles, las instrucciones de los fabricantes deben ser tenidas en cuenta. Los diferentes controles son definidos a continuación. Estos controles deben quedar registrados ya sea en formato digital o físico, y deben ser correctamente almacenados.

Inspección visual rutinaria: el control visual de rutina tiene por objeto la identificación de los riesgos manifiestos que pueden resultar de los actos de vandalismo, de la utilización intensiva o de las condiciones meteorológicas. Deben realizarse cada día. Este control se compone de medidas preventivas destinadas a mantener el nivel de seguridad y las capacidades de los equipos, comprendiendo de manera notable: el estado general de los equipos, el estado general de las plataformas, el estado general de la estructura y el estado general de las balizas y de la señalización.

En caso de constatar deterioro sobre cualquier elemento del recorrido, se deben realizar las operaciones de mantenimiento correctivo. Las operaciones de mantenimiento regulares, que no sean fruto de un deterioro, no serán obligatoriamente consignadas en el registro de mantenimiento (por ejemplo, la limpieza del sitio). Por el contrario, todos los desgastes, deterioros y otros puntos de control defectuosos constatados sobre el recorrido de forma no habitual deben ser descritos en el registro de mantenimiento, junto con las acciones de mantenimiento correctivo correspondientes, precisando: operación efectuada, fecha, Juegos/equipo/lugar corregido y nombre de la persona encargada.

Inspección de funcionamiento: el control funcional es un control rutinario mucho más profundo que tiene por fin verificar la estabilidad del Juego y los equipos, y en particular descubrir los eventuales signos de desgaste normal y anómalo, llevando notablemente sobre: el desgaste de los elementos constitutivos de los Juegos, la presión y par de apriete de los diferentes elementos de construcción, el estado de los sistemas de seguridad y la fijación de los anti-caídas. Es conveniente efectuar este control a intervalos de 1 a 3 meses.

Este control debe incluir una vigilancia del estado general de los árboles portantes. Los árboles pueden estar sometidos a alteraciones de las que pueden ser afectados eventualmente. Conviene pues vigilar particularmente todo problema mecánico, defecto de verticalidad o principio de alteración (fisuras, cavidades, incluyendo a las cortezas, hongos, etc.) que puedan ser descubiertas.

Este tipo de control puede ser realizado puntualmente si las circunstancias lo exigen (accidentes climáticos de tipo tormentas, vientos violentos asociados a un suelo empapado, fuerte nevada, etc.). El control funcional precede a menudo a operaciones de mantenimiento correctivo (presión de las fijaciones, renovación de la pintura, cambio del material o de los elementos de estructura defectuosos, etc.), que deben ser consignadas en el registro de mantenimiento.

Inspección periódica: el control anual principal se efectúa para constatar, al menos una vez al año, el nivel de seguridad global de los equipos, de los cimientos y de las superficies (efectos inducidos por la intemperie, pruebas de deterioro o de corrosión, etc.), así como las eventuales variaciones del nivel de seguridad. Este control debe ser anual y efectuado por un organismo de inspección independiente y competente.`;

  const TEXTO_MANT_EPI = `Todo material sufre daños debidos al envejecimiento y al desgaste. Además, el material puede verse dañado en caso de tener que soportar la caída del usuario. Conviene, pues, verificar visualmente y de forma meticulosa el material antes y después de cada uso a fin de asegurar su buen estado.

Si un producto o parte del producto presenta taras o defectos o si está corroído o contaminado por agentes químicos, deberá ser retirado. En caso de choque violento, todo producto debe ser cambiado, incluso si no tiene ningún signo visible de alteración (especialmente los arneses).

Todo responsable de la gestión de un parque debe poseer un registro de Equipos de Protección Individual en el que sean referenciados todos los equipos. Este registro debe estar constituido por el conjunto de las fichas de vida de los materiales puestos a disposición, así como las notas técnicas de los fabricantes. Todos los materiales deben ser objeto de una identificación individual y su ficha de vida debe comprender los resultados de los diferentes controles periódicos, así como aquellos del control anual principal. Si un producto o uno de sus componentes muestran signos de desgaste o defectos, debe ser cambiado, incluso en caso de duda.

En la mayor parte de las notas técnicas de materiales, la duración de uso de los equipos después de su primer uso está fijada, a título preventivo, en un periodo variando de 3 a 5 años. No obstante, existen numerosos factores que pueden reducir la duración de la seguridad de un producto: utilización intensa (es el caso de los recorridos acrobáticos), medio ambiente desfavorable (ambientes salinos o arenosos), exposición a temperaturas elevadas y a los rayos ultravioletas, corrosión, abrasión, cortes, desgaste, contactos con substancias químicas o fuentes de calor y/o agentes corrosivos, y deformaciones/distorsiones mecánicas y choques violentos.

Incumbe pues al responsable de la gestión o al responsable del material decidir cuándo un artículo debe ser suprimido por razones de seguridad. No se debe dudar en desechar el material que presenta fallos susceptibles de reducir su resistencia o de limitar su funcionamiento y aquellos que presenten síntomas de rupturas internas que puedan llevar a una disminución de su resistencia.

A fin de aumentar la longevidad de los productos, es necesario ser cuidadoso durante el transporte y su uso, también durante el almacenamiento: el material debe estar conservado en un lugar fresco, oscuro, ventilado y seco, al abrigo de la humedad, del hielo, de los ultravioleta y del polvo. La limpieza y, en su caso, la lubricación regular de un producto contribuyen igualmente a prolongar en el tiempo sus cualidades técnicas.`;

  // ── TEXTO FIJO SAE — "Inspección y Mantenimiento", tomado literal del informe SAE
  // antiguo de ARP (págs. 5-6) — más detallado que el de PAA, no es un simple genericizado.
  const TEXTO_MANT_GENERAL_SAE = `Si la instalación no es segura, es conveniente impedir que los usuarios accedan a ella (ejemplos de falta de seguridad son por ejemplo: mantenimiento que no pueda garantizar un nivel de seguridad mínimo de las instalaciones, riesgos graves de seguridad como elementos peligrosos en zonas de uso, debilidad en la integridad estructural, etc).

Del mismo modo, habrá que poner especial atención a todos aquellos problemas que puedan generar deterioros graves en el equipamiento y que puedan arriesgar o amenazar la seguridad del mismo.`;

  const TEXTO_MANT_ORG_SAE = `Es conveniente que el mantenimiento y el control de las instalaciones y de sus componentes sean efectuadas de acuerdo a una frecuencia mínima. Para estos controles, las instrucciones de los fabricantes deben ser tenidas en cuenta. Los diferentes controles son definidos a continuación. Estos controles deben quedar registrados ya sea en formato digital o físico, y deben ser correctamente almacenados.

Inspección visual rutinaria: el control visual de rutina tiene por objeto la identificación de los riesgos manifiestos que pueden resultar de los actos de vandalismo, de la utilización intensiva o de las condiciones meteorológicas. Deben realizarse cada día. Este control se compone de medidas preventivas destinadas a mantener el nivel de seguridad y las capacidades de los equipos, comprendiendo de manera notable: el estado general de los equipos, el estado general de los puntos de anclaje, el estado general de la estructura y el estado general de las balizas y de la señalización.

En caso de constatar deterioro sobre cualquier elemento del equipo, se deben realizar las operaciones de mantenimiento correctivo. Las operaciones de mantenimiento regulares, que no sean fruto de un deterioro, no serán obligatoriamente consignadas en el registro de mantenimiento (por ejemplo, la limpieza del entorno). Por el contrario, todos los desgastes, deterioros y otros puntos de control defectuosos constatados de forma no habitual deben ser descritos en el registro de mantenimiento, junto con las acciones de mantenimiento correctivo correspondientes, precisando: operación efectuada, fecha, juegos/equipo/lugar corregido y nombre de la persona encargada.

Inspección de funcionamiento: el control funcional es un control rutinario mucho más profundo que tiene por fin verificar la estabilidad del equipamiento y sus elementos, y en particular descubrir los eventuales signos de desgaste normal y anómalo, fijándose principalmente en: el desgaste de los elementos constitutivos del equipo, el estado de los diferentes elementos de construcción, el estado de los sistemas de seguridad y la fijación de los elementos móviles. Es conveniente efectuar este control a intervalos de 1 a 3 meses.

Este control debe incluir una vigilancia del estado general de los elementos portantes. Estos elementos pueden estar sometidos a alteraciones de las que pueden ser afectados eventualmente. Conviene pues vigilar particularmente todo problema mecánico, defecto de verticalidad o principio de alteración (fisuras, oxidación, incluyendo a las superficies, etc.) que puedan ser descubiertas.

Este tipo de control puede ser realizado puntualmente si las circunstancias lo exigen (accidentes climáticos, vientos violentos, inundación, uso malintencionado, uso intensivo superior a lo normal, fuerte nevada, etc.). El control funcional precede a menudo a operaciones de mantenimiento correctivo (presión de las fijaciones, renovación de la pintura, cambio del material o de los elementos de estructura defectuosos, sustitución de amortiguación, etc.), que deben ser consignadas en el registro de mantenimiento.

Inspección periódica: el control anual principal se efectúa para constatar, al menos una vez al año, el nivel de seguridad global de los equipos, de la estructura y de las superficies (efectos inducidos por la intemperie, pruebas de deterioro o de corrosión, etc.), así como las eventuales variaciones del nivel de seguridad (distancias, geometría, huecos y atrapamientos, estado de cuerdas, redes, etc. — lista no exhaustiva, dependerá del equipo y área a revisar). Este control debe ser anual y efectuado por un organismo de inspección independiente y competente.`;

  const TEXTO_MANT_EPI_SAE = `Todo material sufre daños debidos al envejecimiento y al desgaste. Además, el material puede verse dañado en caso de tener que soportar la caída del usuario. Conviene, pues, verificar visualmente y de forma meticulosa el material antes y después de cada uso a fin de asegurar su buen estado.

Si un producto o parte del producto presenta taras o defectos o si está corroído o contaminado por agentes químicos, deberá ser retirado. En caso de choque violento con un EPI, todo producto debe ser cambiado, incluso si no tiene ningún signo visible de alteración (especialmente los arneses).

Todo responsable de la gestión de la instalación debe poseer un registro de Equipos de mantenimiento en el que sean referenciados todos los equipos, constituido por el conjunto de fichas de vida de los materiales puestos a disposición así como las notas técnicas de los fabricantes. Todos los materiales deben ser objeto de una identificación individual y su ficha de vida debe comprender los resultados de los diferentes controles periódicos así como los del control anual principal. Si un producto o uno de sus componentes muestran signos de desgaste o defectos, debe ser cambiado, incluso en caso de duda.

En la mayor parte de las notas técnicas de materiales, la duración de uso de los equipos tras su primer uso está fijada, a título preventivo, en un periodo de 3 a 5 años en caso de equipos de seguridad. No obstante, existen numerosos factores que pueden reducir la duración de la seguridad de un producto: utilización intensa, medio ambiente desfavorable (ambientes salinos o arenosos), exposición a temperaturas elevadas y a los rayos ultravioletas, corrosión, abrasión, cortes, desgaste, contactos con substancias químicas o fuentes de calor, deformaciones/distorsiones mecánicas y choques violentos.

Incumbe pues al responsable de la gestión o al responsable del material decidir cuándo un artículo debe ser suprimido por razones de seguridad. No se debe dudar en desechar el material que presente fallos susceptibles de reducir su resistencia o limitar su funcionamiento, así como aquellos que presenten síntomas de rupturas internas que puedan llevar a una disminución de su resistencia.

A fin de aumentar la longevidad de los productos, es necesario ser cuidadoso durante el transporte, el uso y el almacenamiento: el material debe conservarse en un lugar fresco, oscuro, ventilado y seco, al abrigo de la humedad, del hielo, de los ultravioleta y del polvo. La limpieza y, en su caso, la lubricación regular de un producto contribuyen igualmente a prolongar en el tiempo sus cualidades técnicas.`;

  // ── TEXTO FIJO FER (Vías Ferratas) ──
  // Tomado literal del informe FER de referencia de ARP (Informe XXX/FER/XXXXXX Rev.4, págs. 4 y 8-9).
  const TEXTO_METODOLOGIA_1_FER = `Las Vías Ferratas son espacios de actividad lúdica que permiten al usuario recorrer distancias por la montaña con mayor o menor dificultad, paredes y muros, mediante puntos de seguridad introducidos en los mismos, permitiendo al usuario ascender de forma segura. Se define en normativa como: "Recorrido, generalmente en terreno rocoso, que consta de una instalación de escalada fija que incluye una línea de seguridad, en la que el usuario no está bajo supervisión".

Es una actividad que requiere de uso obligatorio de equipos de protección individual (EPI), bien sea propiedad del usuario, bien se realice un alquiler del mismo en la propia instalación.

ARP Prevención interviene en el cuadro de las exigencias normativas que se aplican a los explotadores o responsables de la gestión de las vías ferratas. Se utiliza para ello la norma UNE EN 16.869 Diseño/construcción de vía ferrata:
— Una inspección previa a la apertura de la instalación y de toda modificación ulterior.
— Una inspección anual de los recorridos para verificar el estado y para determinar las acciones de puesta en conformidad que deben ser realizadas.

El diagnóstico visual realizado por ARP Prevención consiste en medir la diferencia entre el nivel de seguridad exigido por la normativa y el nivel real de seguridad constatado sobre los equipos in situ. Se excluyen de la inspección las exigencias de explotación (inspecciones y operaciones de mantenimiento, información de los usuarios, registros de accidentes, etc.), que son responsabilidad del gestor de las instalaciones.

Nota.- Para esta actividad de control ARP Prevención interviene de manera totalmente externa, siendo de este modo conforme a los criterios de independencia de los organismos que proceden a la inspección de tipo C tal como están definidos en el Anexo A de la norma UNE EN ISO/IEC 17 020 : 2012. Además ARP Prevención dispone de un seguro de responsabilidad civil específico.`;

  const TEXTO_METODOLOGIA_2_FER = `Para esta prestación el técnico de ARP Prevención dispone del material EPI siguiente:
— Un arnés de seguridad
— Disipador de energía de caída, una polea, y cintas cortas
— Dos mosquetones automáticos, dos mosquetones de doble seguridad, anilla de sujeción
— Un dispositivo de descenso, ascenso y anclaje

El inspector de ARP Prevención dispone además del material siguiente en medición:
— Un aparato de fotos y video (móvil/equipo específico)
— Un sistema de tracción-extracción con un sistema de medición de fuerzas (Dinamómetro)
— Equipo de medición móvil: Pie de Rey, Goniómetro, inclinómetro, Llave dinamométrica, cronómetro, Flexómetro

Todos los equipos de medición cuentan con trazabilidad ENAC ya sea por laboratorio externo o verificación interna.`;

  const TEXTO_MANT_GENERAL_FER = `Si la instalación no es segura, es conveniente impedir a los usuarios acceder a ella (ejemplos: la seguridad de la instalación no es total; el mantenimiento no puede garantizar un nivel constante de seguridad…). Este caso puede deberse, bien a problemas técnicos en la colocación de la línea de vida, puntos de anclaje, etc., bien al deterioro del material por algún punto por oxidación, desgaste, etc.

Se concluye que conviene poner remedio inmediatamente a los deterioros que se producen y que pueden arriesgar o amenazar la seguridad.`;

  const TEXTO_MANT_ORG_FER = `Es conveniente que el mantenimiento y el control de las instalaciones y de sus componentes sean efectuadas de acuerdo a una frecuencia mínima. Para estos controles, las instrucciones de los fabricantes deben ser tenidas en cuenta. Los diferentes controles son definidos a continuación.

Mantenimiento de rutina: El control visual de rutina tiene por objeto la identificación de los riesgos manifiestos que pueden resultar de los actos de vandalismo, de la utilización intensiva o de las condiciones meteorológicas. Deben realizarse cada día. Este control se compone de medidas preventivas destinadas a mantener el nivel de seguridad y las capacidades de los equipos, comprendiendo de manera notable: el estado general de los equipos, el estado general del cable, anclajes y las plataformas (si las hubiera), y el estado general de las balizas y de la señalización.

En caso de constatar deterioro sobre cualquier elemento del recorrido, se deben realizar las operaciones de mantenimiento correctivo. Las operaciones de mantenimiento regulares, que no sean fruto de un deterioro, no serán obligatoriamente consignadas en el registro de mantenimiento (por ejemplo, la limpieza del sitio). Por el contrario, todos los desgastes, deterioros y otros puntos de control defectuosos constatados de forma no habitual deben ser consignados en el registro de mantenimiento, junto con las acciones de mantenimiento correctivo correspondientes, precisando: operación efectuada, fecha, tramo/equipo/lugar corregido, persona encargada y, si procede, la ficha del equipo o el albarán de compra.

Control funcional: es un control rutinario mucho más profundo que tiene por fin verificar la estabilidad del elemento y, en particular, descubrir los eventuales signos de desgaste normal y anómalo, llevando notablemente sobre: el desgaste de los elementos constitutivos de la Vía Ferrata y el estado de los sistemas de seguridad, anclajes y línea de vida. Es conveniente efectuar este control a intervalos de 1 a 3 meses.

Este control debe incluir una vigilancia del estado general de la roca y de la zona por la que transcurre la línea de vida a fin de evitar accidentes causados por roturas y/o desprendimientos. Si se utilizasen árboles portantes en algún punto para fijar la línea de vida, éstos deberán ser también objeto de la inspección, vigilando particularmente todo problema mecánico, defecto de verticalidad o principio de alteración (fisuras, cavidades, cortezas, hongos, etc.).

Este tipo de control puede realizarse puntualmente si las circunstancias lo exigen (tormentas, vientos violentos asociados a suelo empapado, fuerte nevada, etc.). Un control funcional es a menudo seguido por operaciones de mantenimiento correctivo (presión de las fijaciones, renovación de la pintura, cambio del material o de los elementos defectuosos, etc.), que deben ser consignadas en el registro de mantenimiento.

Control anual principal: se efectúa para constatar, al menos una vez al año, el nivel de seguridad global de la vía y de las superficies (efectos inducidos por la intemperie, pruebas de deterioro o de corrosión, etc.), así como las eventuales variaciones del nivel de seguridad. Este control debe ser anual y efectuado por un organismo independiente y competente.`;

  const TEXTO_RESULTADOS = `Los resultados de la inspección están organizados por capítulos, listando el conjunto de los puntos de inspección que componen el diagnóstico de seguridad, para el recorrido en su conjunto. En el presente informe se detallan tanto las observaciones de carácter más grave, como los consejos o recomendaciones de seguridad que puedan ser aportados por el inspector en la inspección in situ de las instalaciones.

Las observaciones consideradas como NO CONFORMIDAD a norma, vendrán reflejadas por 4 niveles de severidad:

— Graves: puntos de no cumplimiento normativo que presentan riesgos para la integridad estructural o la seguridad de los usuarios, y que por tanto deben ser modificados o corregidos lo antes posible.
— Medio: puntos de divergencia respecto a la normativa en vigor que deben ser tenidos en consideración por parte del gestor de la actividad para que el riesgo no vaya a más y cumplir con la normativa. En este caso se deberán realizar operaciones correctivas pero sin carácter de urgencia.
— Leves: puntos de no cumplimiento normativo cuyo riesgo de daño para los usuarios es bajo. Precisan de acción correctora por parte del gestor de la actividad para que no se agraven.
— Documentales: en este caso ARP PREVENCIÓN se referirá a la falta de documentos técnicos para revisar o informes técnicos que necesiten ser entregados por el gestor/constructor del parque.

En caso de que la inspección resulte con NO CONFORMIDADES, la metodología será la siguiente:

— Existencia de NO CONFORMIDADES: se dará un plazo al gestor/constructor de las instalaciones para la modificación de las mismas y presentar los cambios a la entidad de inspección. Plazo no superior a 6 meses dependiendo del tipo de modificación a realizar. Si los cambios son satisfactorios se eliminaría la NO CONFORMIDAD. Estos cambios deberán ser controlados por la entidad de inspección, bien con fotografías representativas del cambio, bien por una segunda visita del inspector a las instalaciones si fuera necesario. En caso de ser modificaciones que no pudieran ser chequeadas por una fotografía, se exigiría una declaración del personal que realizó la modificación o nueva visita. En caso de ser cambios importantes (modificación de línea de vida, sustitución de retos, etc.) el certificado irá ligado a la presentación por parte del gestor de un plan de mantenimiento correctivo específico.
— Existencia de NO CONFORMIDADES graves y leves: el gestor de la actividad deberá presentar la misma documentación en ambos casos; sin embargo, la diferencia es que la no conformidad grave entraña un riesgo directo e inminente que puede suceder sobre las personas, mientras que la no conformidad leve provoca un riesgo menor o un menor daño. En las inspecciones anuales se revisará el estado de la observación de los pasados años para comprobar que se ha mejorado su estado o que se ha eliminado el riesgo.
— Existencia de NO CONFORMIDADES documentales: se requerirá por parte del gestor la entrega de la documentación que no haya sido facilitada, anotándose en el informe la falta de la misma. En cualquier caso debe ser entregada en plazo máximo, de esa manera podrá retirarse la NO CONFORMIDAD.

En caso de ausencia de no conformidad, el certificado será emitido una vez concluido y confirmado el pago del servicio.`;

  // ── TEXTO FIJO FER — "Resultados de la inspección", tomado literal del informe FER
  // de referencia de ARP (Informe XXX/FER/XXXXXX Rev.4, págs. 5-6) — más detallado que
  // el genérico de PAA (incluye prioridades y el procedimiento completo de resolución de NC).
  const TEXTO_RESULTADOS_FER = `Los resultados de la inspección están organizados por capítulos, listando el conjunto de los puntos de inspección que componen el diagnóstico de seguridad, para el recorrido en su conjunto.

En el presente informe se detallan tanto las observaciones de carácter más grave, como los consejos o recomendaciones de seguridad que puedan ser aportados por el inspector en la inspección in situ de las instalaciones.

Las observaciones consideradas como NO CONFORMIDAD a norma, vendrán reflejadas por 3 niveles de severidad:

— Graves: puntos de no cumplimiento normativo que presentan riesgos para la integridad estructural o la seguridad de los usuarios, y que por tanto deben ser modificados o corregidos de forma urgente. Representan las NO CONFORMIDADES de tipo GRAVE. Este tipo de observaciones resulta en acciones de Prioridad Alta (requiere acción correctora en menos de 6 meses) o Muy Alta (precisa de acción correctora inmediata, en caso contrario deberá inhabilitarse el tramo en cuestión).
— Medias: puntos de no cumplimiento normativo que no presentan riesgos para la integridad estructural o la seguridad de los usuarios de forma inmediata, pero que pueden causarlos si no se toman medidas correctoras sobre los mismos. Representan las NO CONFORMIDADES de tipo Media. En este caso se deberán realizar operaciones correctivas sabiendo que pueden producirse daños contra las personas en su uso.
— Leves: puntos de divergencia respecto a la normativa en vigor que deben ser tenidos en consideración por parte del gestor de la actividad para que el riesgo no vaya a más o bien para que no se transformen en NO CONFORMIDADES de tipo Leve. Precisa de acción correctora y deben reflejarse. Este tipo de observaciones resulta en acciones de Prioridad Baja (precisa de atención por parte del gestor de la actividad, aunque implica un riesgo menos directo).
— Documentales: en este caso ARP Prevención se referirá a la falta de documentos técnicos para revisar o informes técnicos que necesiten ser entregados por el gestor/constructor.

En caso de que la inspección resulte con NO CONFORMIDADES, la metodología será la siguiente:

— Existencia de NO CONFORMIDADES: se dará un plazo al gestor/constructor de las instalaciones para la modificación de estas y presentar los cambios a la entidad de inspección, no superior a 3 meses dependiendo del tipo de modificación a realizar. Si los cambios fueran satisfactorios se eliminaría la NO CONFORMIDAD y se procedería a su validación. Estos cambios deberán ser controlados por la entidad de inspección, bien con fotografías representativas del cambio, bien por una segunda visita del inspector a las instalaciones si fuera necesario. En caso de ser modificaciones que no pudieran ser chequeadas por una fotografía, se exigiría una declaración del personal que realizó la modificación. En caso de ser cambios importantes (modificación de línea de vida, sustitución de retos, etc.) el certificado irá ligado a la presentación por parte del gestor de un plan de mantenimiento correctivo específico.
— Existencia de NO CONFORMIDADES graves y leves: el gestor de la actividad deberá presentar la misma documentación en ambos casos; sin embargo, la no conformidad grave entraña un riesgo directo e inminente sobre las personas, mientras que la leve provoca un riesgo menor. En las inspecciones anuales se revisará el estado de la observación de los años anteriores para comprobar que se ha mejorado o eliminado el riesgo.
— Existencia de NO CONFORMIDADES documentales: se requerirá al gestor la entrega de la documentación no facilitada, anotándose en el informe su falta. Debe ser entregada en plazo máximo para poder retirarse la NO CONFORMIDAD.

En caso de ausencia de no conformidad, el registro de validez de los tramos es directamente anexado al informe, así como la certificación de conformidad bajo reserva de que la apreciación de la resistencia de los soportes haya sido efectuada y sea válida.`;

  // ── TEXTO FIJO SAE — "Resultados de la inspección", tomado literal del informe SAE
  // de referencia de ARP (Informe XXX/SAE/XXXXX Rev.6, págs. 7-8), con el nivel "Media"
  // añadido para que la narrativa cuadre con los 4 niveles de severidad reales del sistema
  // de NC de la app (el documento original SAE solo definía Graves/Leves/Documentales).
  const TEXTO_RESULTADOS_SAE = `Los resultados de la inspección están organizados por capítulos, listando el conjunto de los puntos de inspección que componen el diagnóstico de seguridad, para el recorrido en su conjunto.

En el presente informe se detallan tanto las observaciones de carácter más grave, como los consejos o recomendaciones de seguridad que puedan ser aportados por el inspector en la inspección in situ de las instalaciones.

Las observaciones consideradas como NO CONFORMIDAD a norma, vendrán reflejadas por niveles de severidad:

— Graves: puntos de no cumplimiento normativo que presentan riesgos para la integridad estructural o la seguridad de los usuarios, y que por tanto deben ser modificados o corregidos lo antes posible.
— Medias: puntos de no cumplimiento normativo que no presentan riesgos para la integridad estructural o la seguridad de los usuarios de forma inmediata, pero que pueden causarlos si no se toman medidas correctoras sobre los mismos. En este caso se deberán realizar operaciones correctivas pero sin carácter de urgencia.
— Leves: puntos de divergencia respecto a la normativa en vigor que deben ser tenidos en consideración por parte del gestor de la actividad para que el riesgo no se agrave y cumplir con la normativa.
— Documentales: en este caso ARP PREVENCIÓN se referirá a la falta de documentos técnicos para revisar o informes técnicos que necesiten ser entregados por el gestor/constructor del parque.

En caso de que la inspección resulte con NO CONFORMIDADES, la metodología será la siguiente:

— Existencia de NO CONFORMIDADES: se dará un plazo al gestor/constructor de las instalaciones para la modificación de las mismas y presentar los cambios a la entidad de inspección. Plazo no superior a 6 meses dependiendo del tipo de modificación a realizar. Si los cambios fueran satisfactorios se eliminaría la NO CONFORMIDAD y se procedería a su validación. Estos cambios deberán ser controlados por la entidad de inspección, bien con fotografías representativas del cambio, bien por una segunda visita del inspector a las instalaciones si fuera necesario. En caso de ser modificaciones que no pudieran ser chequeadas por una fotografía, se exigiría una declaración del personal que realizó la modificación. En caso de ser cambios importantes (modificación de línea de vida, sustitución de retos, etc.) el certificado irá ligado a la presentación por parte del gestor de un plan de mantenimiento correctivo específico.
— Existencia de NO CONFORMIDADES graves y leves: el gestor de la actividad deberá presentar la misma documentación en ambos casos; sin embargo, la no conformidad grave entraña un riesgo directo e inminente sobre las personas, mientras que la leve provoca un riesgo menor o un menor daño y trata de resolver un punto indicado por la normativa. En las inspecciones anuales se revisará el estado de la observación de los pasados años para comprobar que se ha mejorado su estado o que se ha eliminado el riesgo.
— Existencia de NO CONFORMIDADES documentales: se requerirá por parte del gestor la entrega de la documentación que no haya sido facilitada, anotándose en el informe la falta de la misma. En cualquier caso debe ser entregada en plazo máximo, de esa manera podrá retirarse la NO CONFORMIDAD.

En caso de ausencia de no conformidad, el registro de validez de los Juegos es directamente anexado al informe, así como la certificación de conformidad bajo reserva de que la apreciación de la resistencia de los soportes haya sido efectuada y sea válida.`;

  const TEXTO_CARACTERISTICAS = `ADELL RIESGOS Y PREVENCIÓN, S.L como organismo de inspección realiza en todas sus intervenciones los controles siguientes:

— Comprobación visual rutinaria
— Inspección del funcionamiento
— Ensayo del funcionamiento efectuado en altura por un inspector
— Evaluación de los talleres desgastados y requisitos para su sustitución
— Verificación de que se han seguido todas las instrucciones de mantenimiento del fabricante/proveedor
— Verificación de que los cables recubiertos de plástico se han sometido a ensayo conforme la norma
— Comprobación del diagnóstico arbóreo actualizado para confirmar que todos los árboles utilizados como sistema de soporte se han considerado seguros para su uso
— Verificación de que existe un informe de inspección del EPI

Documentos realizados en el informe de inspección por ADELL RIESGOS Y PREVENCIÓN, S.L, cumpliendo el artículo 7.1.5 de informes de inspección:
— La identificación del organismo emisor
— El lugar y la fecha de la inspección
— La identificación del taller o talleres inspeccionados
— El nombre, la dirección y la firma del inspector
— Una declaración de conformidad cuando proceda
— Un registro de todos los defectos encontrados
— Información sobre lo que se haya omitido en el campo de aplicación original de la inspección
— Una declaración indicando que el informe de la inspección no se debería reproducir salvo en su integridad
— El presente documento se debe incluir en la documentación de utilización de la instalación.`;

  // ── TEXTO FIJO SAE — "Características de Inspección", tomado literal del informe SAE
  // antiguo de ARP (Informe XXX/SAE/XXXXX Rev.X, pág. 18), no del genérico de PAA.
  const TEXTO_CARACTERISTICAS_SAE = `ADELL RIESGOS Y PREVENCIÓN, S.L como organismo de inspección realiza en todas sus intervenciones los controles siguientes:

— Comprobación visual rutinaria
— Inspección del funcionamiento
— Ensayo del funcionamiento efectuado in-situ por un inspector
— Evaluación de los talleres desgastados y requisitos para su sustitución
— Verificación de que se han seguido todas las instrucciones de mantenimiento del fabricante/proveedor
— Verificación de que existe un informe de inspección de materiales

Documentos realizados en el informe de inspección por ADELL RIESGOS Y PREVENCIÓN, S.L, cumpliendo el artículo 7.1.5 de informes de inspección:
— La identificación del organismo emisor
— El lugar y la fecha de la inspección
— La identificación del taller o talleres inspeccionados
— El nombre, la dirección y la firma del inspector
— Una declaración de conformidad cuando proceda
— Un registro de todos los defectos encontrados
— Información sobre lo que se haya omitido en el campo de aplicación original de la inspección
— Una declaración indicando que el informe de la inspección no se debería reproducir salvo en su integridad
— El presente documento se debe incluir en la documentación de utilización de la instalación.`;

  // ── Leyenda de colores de no conformidades (va tras los niveles de severidad) ──
  const LEYENDA_NC = [
    { prio: 'GRAVE',      texto: 'NO CONFORMIDAD GRAVE, NECESITA ACCIÓN CORRECTORA URGENTE AL PODER PROVOCAR UN RIESGO INMEDIATO.' },
    { prio: 'MEDIA',      texto: 'NO CONFORMIDAD MEDIA, NECESITA ACCIÓN CORRECTORA.' },
    { prio: 'LEVE',       texto: 'NO CONFORMIDAD LEVE, NECESITA ACCIÓN, EL RIESGO DE DAÑO ES BAJO.' },
    { prio: 'DOCUMENTAL', texto: 'NO CONFORMIDAD DOCUMENTAL, FALTA DOCUMENTACIÓN.' },
  ];

  // ── Anexos ──
  const ANEXOS_TITULO = 'Documentos realizados por ADELL RIESGOS Y PREVENCIÓN, S.L:';
  const ANEXOS_DOCS = [
    'Atestado de conformidad (en caso de que no haya situaciones de riesgo grave que subsanar)',
    'Informe de inspección (presente documento)',
    'Listado de Observaciones (a continuación)',
  ];
  const ANEXOS_ENSAYOS_TITULO = 'Ensayos o partes de norma no realizados:';
  const ENSAYOS_POR_DEFECTO = 'No se realiza ensayo de inercia.';

  // ── Criterios específicos de PAA (ref. normativa y descripción por columna) ──
  // El snapshot formatoDocumento.columnas solo trae id/label/abbrev: ref y desc salen de aquí.
  const COLUMNAS_PAA = [
    { key: 'ie', label: 'Integridad estructural',        ref: '4.3',   desc: 'Verificación del estado resistente del Juego: soportes, plataformas, cables portantes y elementos estructurales.' },
    { key: 'af', label: 'Anclajes y fijaciones',         ref: '4.3.3', desc: 'Comprobación de anclajes, uniones, grapas, prensados y tensado de cables.' },
    { key: 'ej', label: 'Elementos de juego/Progresión', ref: '4.2',   desc: 'Verificación del estado y funcionalidad de los elementos de progresión.' },
    { key: 'ra', label: 'Riesgos y atrapamientos',       ref: '4.4',   desc: 'Evaluación de posibles riesgos de atrapamiento, cizallamiento e interferencias.' },
    { key: 'zs', label: 'Zona de seguridad / Entorno',   ref: '4.1',   desc: 'Comprobación de distancias libres, ausencia de obstáculos y condiciones de evacuación.' },
  ];

  const TEXTOS = {
    TEXTO_METODOLOGIA_1, TEXTO_METODOLOGIA_1_SAE, TEXTO_METODOLOGIA_1_FER,
    TEXTO_METODOLOGIA_2, TEXTO_METODOLOGIA_2_SAE, TEXTO_METODOLOGIA_2_FER,
    TEXTO_MANT_GENERAL, TEXTO_MANT_ORG, TEXTO_MANT_EPI,
    TEXTO_MANT_GENERAL_SAE, TEXTO_MANT_ORG_SAE, TEXTO_MANT_EPI_SAE,
    TEXTO_MANT_GENERAL_FER, TEXTO_MANT_ORG_FER,
    TEXTO_RESULTADOS, TEXTO_RESULTADOS_SAE, TEXTO_RESULTADOS_FER,
    TEXTO_CARACTERISTICAS, TEXTO_CARACTERISTICAS_SAE,
  };

  function porAlcance(alcance, mapa, fallbackPaa) { return mapa[alcance] || fallbackPaa; }

  // Apartados de MANTENIMIENTO por alcance: [título, texto]
  function mantenimiento(alcance) {
    const mapa = {
      SAE: [
        ['I. Generalidades', TEXTO_MANT_GENERAL_SAE],
        ['II. Inspección', TEXTO_MANT_ORG_SAE],
        ['III. Consignas de mantenimiento y de almacenamiento de los EPI o equipos de protección colectiva (redes, cuerdas, colchonetas, etc)', TEXTO_MANT_EPI_SAE],
      ],
      FER: [
        ['I. Generalidades', TEXTO_MANT_GENERAL_FER],
        ['II. Organización del mantenimiento', TEXTO_MANT_ORG_FER],
      ],
    };
    return mapa[alcance] || [
      ['I. Generalidades', TEXTO_MANT_GENERAL],
      ['II. Organización del mantenimiento', TEXTO_MANT_ORG],
      ['III. Consignas de mantenimiento y de almacenamiento de los EPI', TEXTO_MANT_EPI],
    ];
  }

  // "II. Resultados de la inspección" se parte en dos: los niveles de severidad (tras los
  // que va la leyenda de colores) y la metodología de resolución de NC.
  function resultados(alcance) {
    const t = porAlcance(alcance, { SAE: TEXTO_RESULTADOS_SAE, FER: TEXTO_RESULTADOS_FER }, TEXTO_RESULTADOS);
    const corte = t.indexOf('\n\nEn caso de que la inspección resulte con NO CONFORMIDADES');
    return corte >= 0 ? { niveles: t.slice(0, corte), metodo: t.slice(corte + 2) } : { niveles: t, metodo: '' };
  }

  // "I. Localización" de la descripción. d = {municipio, direccion, nombre, nCircuitos,
  // totalJuegos, totalElementos, resumenTipos}
  function localizacion(esTiposJuego, d) {
    if (esTiposJuego) {
      const n = d.nCircuitos;
      return `La instalación a la que se hace referencia en el presente informe se encuentra ubicada en el municipio de ${d.municipio}, más concretamente en ${d.direccion}.

La instalación objeto de la presente inspección se denomina ${d.nombre}, consta de ${n} elemento${n !== 1 ? 's' : ''} inspeccionado${n !== 1 ? 's' : ''}${d.resumenTipos ? ' (' + d.resumenTipos + ')' : ''}.`;
    }
    return `El parque al que se hace referencia en el presente informe se encuentra ubicado en el municipio de ${d.municipio}, más concretamente en ${d.direccion}.

La instalación objeto de la presente inspección se denomina ${d.nombre}, consta de ${d.totalJuegos} juegos (${d.totalElementos} elementos inspeccionados, divididos en ${d.nCircuitos} circuito${d.nCircuitos !== 1 ? 's' : ''}).`;
  }

  // ── Estructura del informe en el orden en que se imprime ──
  // Lista de bloques {s: sección, k: tipo, x: texto}. Tipos: h1 (título de sección),
  // h2 (apartado), h3, p (texto fijo), ley (franja de la leyenda NC), fila (cabecera de
  // tabla de checklist/criterio), nota (texto auxiliar fijo), var (contenido que depende
  // de cada inspección, descrito entre corchetes).
  // formato = { checklist, columnas, tiposJuego, normaAplicable, normasDetalle }
  function estructura(alcance, formato) {
    alcance = String(alcance || 'PAA').toUpperCase();
    formato = formato || {};
    const norma = formato.normaAplicable || { numero: '', titulo: '', tipoInstalacion: '' };
    const tipos = formato.tiposJuego && formato.tiposJuego.length ? formato.tiposJuego : null;
    const tipoInst = norma.tipoInstalacion || '';
    const tituloDesc = tipos ? 'DESCRIPCIÓN DE LA INSTALACIÓN' : 'DESCRIPCIÓN DEL RECORRIDO';
    const tituloInsp = tipos ? 'INSPECCIÓN — ' + (tipoInst || 'LA INSTALACIÓN').toUpperCase() : 'INSPECCIÓN DE PARQUES DE AVENTURA';
    const B = [];
    let sec = '';
    const add = (k, x) => B.push({ s: sec, k: k, x: String(x == null ? '' : x) });
    const pars = t => String(t || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => add('p', l));

    sec = 'Portada';
    add('h1', 'Inspección de'); add('h1', tipoInst); add('h1', 'según ' + (norma.numero || ''));
    add('var', '[Nombre de la instalación, localidad, dirección y nº de registro]');
    add('var', '[Fecha(s) de inspección e inspector(es)]');

    sec = 'Cabecera y pie de página';
    add('p', 'INFORME DE INSPECCIÓN — INSTALACIONES ' + tipoInst.toUpperCase());
    add('var', '[Rev. y fecha del formato · nº de registro · Página X de Y]');

    sec = 'Índice';
    add('h1', 'ÍNDICE');
    ['METODOLOGÍA', 'I. Naturaleza de la inspección', 'II. Material utilizado', 'MANTENIMIENTO', 'RESULTADOS DE LA INSPECCIÓN',
      tituloDesc, tituloInsp, 'ANEXOS', 'LISTADO DE OBSERVACIONES', 'CARACTERÍSTICAS DE INSPECCIÓN'].forEach(t => add('p', t));

    sec = 'Datos de la inspección';
    add('h1', 'INFORME DE INSPECCIÓN');
    add('p', 'INSPECCIÓN DE INSTALACIONES ' + tipoInst.toUpperCase());
    add('p', 'PROPIETARIO DE LAS INSTALACIONES'); add('var', '[Propietario, instalación y CIF]');
    add('p', 'GESTOR DE LAS INSTALACIONES:'); add('var', '[Gestor]');
    add('p', 'SOLICITANTE DE LA INSPECCION'); add('var', '[Solicitante]');
    add('p', 'TIPO DE INSPECCION'); add('var', '[Inicial / Anual / Extraordinaria]');
    add('p', 'ORGANISMO DE INSPECCIÓN'); add('var', '[Nombre, sede, teléfono y e-mail de la empresa]');

    sec = 'Metodología';
    add('h1', 'METODOLOGÍA');
    add('h2', 'I. Naturaleza de la inspección');
    pars(porAlcance(alcance, { SAE: TEXTO_METODOLOGIA_1_SAE, FER: TEXTO_METODOLOGIA_1_FER }, TEXTO_METODOLOGIA_1));
    add('h2', 'II. Material utilizado');
    pars(porAlcance(alcance, { SAE: TEXTO_METODOLOGIA_2_SAE, FER: TEXTO_METODOLOGIA_2_FER }, TEXTO_METODOLOGIA_2));

    sec = 'Mantenimiento';
    add('h1', 'MANTENIMIENTO');
    mantenimiento(alcance).forEach(([t, x]) => { add('h2', t); pars(x); });

    sec = 'Resultados de la inspección';
    add('h1', 'RESULTADOS DE LA INSPECCIÓN');
    add('h2', 'I. Normativa de referencia:');
    const normas = formato.normasDetalle && formato.normasDetalle.length ? formato.normasDetalle : [norma];
    normas.forEach(n => add('p', (n.numero || '') + (n.titulo ? ': ' + n.titulo : '')));
    add('h2', 'II. Resultados de la inspección');
    const r = resultados(alcance);
    pars(r.niveles);
    LEYENDA_NC.forEach(l => add('ley', l.texto));
    pars(r.metodo);

    sec = tituloDesc.charAt(0) + tituloDesc.slice(1).toLowerCase();
    add('h1', tituloDesc);
    add('h2', 'I. Localización');
    pars(localizacion(!!tipos, {
      municipio: '[municipio]', direccion: '[dirección]', nombre: '[nombre de la instalación]',
      nCircuitos: '[nº]', totalJuegos: '[nº]', totalElementos: '[nº]',
      resumenTipos: tipos ? '[nº por tipo de elemento]' : '',
    }));
    add('h2', tipos ? 'II. Descripción de los elementos' : 'II. Descripción de los juegos');
    add('var', tipos ? '[Fotografía y nombre de cada elemento]' : '[Fotografía y nombre de cada juego, agrupados por circuito]');

    sec = tituloInsp.charAt(0) + tituloInsp.slice(1).toLowerCase();
    add('h1', tituloInsp);
    add('h2', 'I. General');
    add('nota', 'Columnas de cada tabla: SAT. · N.S. · N.A. · NOTAS SI/NO OBSERVACIONES');
    add('nota', 'Bajo cada tabla: Sat. : Satisfactorio; N. S.: no satisfactorio; N.A.: no aplica');
    (formato.checklist || []).forEach(it => { add('fila', ((it.ref || '') + ' ' + (it.sec || '')).trim()); add('p', it.desc || ''); });
    add('var', '[Observaciones Generales, si las hay]');
    add('h2', tipos ? 'II. Específica — Resumen por elemento' : 'II. Específica Circuitos y Juegos');
    if (tipos) {
      tipos.forEach(t => {
        add('h3', t.label || t.id);
        (t.columnas || []).forEach(c => add('fila', c.label || c.id));
      });
    } else {
      const cols = formato.columnas && formato.columnas.length
        ? formato.columnas.map(c => Object.assign({}, COLUMNAS_PAA.find(d => d.key === c.id) || {}, { label: c.label }))
        : COLUMNAS_PAA;
      cols.forEach(c => { add('fila', ((c.ref || '') + ' ' + (c.label || '')).trim()); if (c.desc) add('p', c.desc); });
    }

    sec = 'Anexos';
    add('h1', 'ANEXOS');
    add('h2', ANEXOS_TITULO);
    ANEXOS_DOCS.forEach(d => add('p', '— ' + d));
    add('h2', ANEXOS_ENSAYOS_TITULO);
    add('p', '— ' + ENSAYOS_POR_DEFECTO + ' (por defecto, si la inspección no indica otros)');

    sec = 'Listado de observaciones';
    add('h1', 'LISTADO DE OBSERVACIONES');
    add('var', '[Una ficha por tipo de observación: elementos afectados, «Observación:», fotografía, «Referencia normativa:», prioridad, «Modificación» y «RESOLUCIÓN»]');

    sec = 'Características de inspección';
    add('h1', 'CARACTERÍSTICAS DE INSPECCIÓN');
    pars(porAlcance(alcance, { SAE: TEXTO_CARACTERISTICAS_SAE }, TEXTO_CARACTERISTICAS));
    add('var', '[Fecha de emisión del informe e inspector(es)]');
    add('p', 'Inspector Autorizado');
    add('p', 'Inspector · Revisor');
    return B;
  }

  // Huella para detectar si la plantilla ha cambiado respecto a la última revisión publicada.
  function huella(bloques) {
    return JSON.stringify((bloques || []).map(b => [b.s, b.k, b.x]));
  }

  // ── Comparación entre dos plantillas (comparar-informe.html y modo comparativa del PDF) ──
  // Devuelve una lista de operaciones en el orden de la plantilla nueva:
  //   eq (igual), ins (añadido), del (eliminado), mod (modificado: a = antes, b = después),
  //   movA (movido a esta posición), movDe (movido desde esta posición; par = índice del movA).
  function lcs(a, b, eq) {
    const n = a.length, m = b.length, t = [];
    for (let i = 0; i <= n; i++) t.push(new Int32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
      t[i][j] = eq(a[i], b[j]) ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    const ops = []; let i = 0, j = 0;
    while (i < n && j < m) {
      if (eq(a[i], b[j])) { ops.push({ t: 'eq', a: a[i], b: b[j] }); i++; j++; }
      else if (t[i + 1][j] >= t[i][j + 1]) { ops.push({ t: 'del', a: a[i] }); i++; }
      else { ops.push({ t: 'ins', b: b[j] }); j++; }
    }
    while (i < n) ops.push({ t: 'del', a: a[i++] });
    while (j < m) ops.push({ t: 'ins', b: b[j++] });
    return ops;
  }
  const clave = b => b.k + '|' + b.x;
  const palabras = s => String(s).split(/(\s+)/).filter(x => x !== '');
  function similitud(x, y) {
    const A = palabras(x).filter(w => w.trim()), B = palabras(y).filter(w => w.trim());
    if (!A.length || !B.length) return 0;
    const setB = {}; B.forEach(w => { const k = w.toLowerCase(); setB[k] = (setB[k] || 0) + 1; });
    let comunes = 0; A.forEach(w => { const k = w.toLowerCase(); if (setB[k]) { comunes++; setB[k]--; } });
    return 2 * comunes / (A.length + B.length);
  }
  function diffBloques(viejo, nuevo) {
    const ops = lcs(viejo, nuevo, (x, y) => clave(x) === clave(y));
    // Movidos: un bloque eliminado en un sitio y añadido idéntico en otro.
    const insPorClave = {};
    ops.forEach((o, i) => { if (o.t === 'ins') (insPorClave[clave(o.b)] = insPorClave[clave(o.b)] || []).push(i); });
    ops.forEach((o, i) => {
      if (o.t !== 'del') return;
      const lista = insPorClave[clave(o.a)];
      if (lista && lista.length) { const j = lista.shift(); o.t = 'movDe'; ops[j].t = 'movA'; o.par = j; ops[j].par = i; }
    });
    // Modificados: en cada tramo de cambios, emparejar eliminado/añadido del mismo tipo y
    // parecidos (≥ 50 % de palabras en común), para compararlos palabra a palabra.
    let i = 0;
    while (i < ops.length) {
      if (ops[i].t !== 'del' && ops[i].t !== 'ins') { i++; continue; }
      const ini = i; while (i < ops.length && (ops[i].t === 'del' || ops[i].t === 'ins')) i++;
      const dels = [], inss = [];
      for (let k = ini; k < i; k++) (ops[k].t === 'del' ? dels : inss).push(k);
      dels.forEach(d => {
        let mejor = -1, mejorS = 0.5;
        inss.forEach(n => {
          if (ops[n].t !== 'ins' || ops[n].b.k !== ops[d].a.k) return;
          const s = similitud(ops[d].a.x, ops[n].b.x); if (s >= mejorS) { mejorS = s; mejor = n; }
        });
        if (mejor >= 0) { ops[mejor].t = 'mod'; ops[mejor].a = ops[d].a; ops[d].t = 'skip'; }
      });
    }
    return ops.filter(o => o.t !== 'skip');
  }
  // Diferencia palabra a palabra: [{t:'eq'|'ins'|'del', x}]
  function diffPalabras(viejo, nuevo) {
    return lcs(palabras(viejo), palabras(nuevo), (x, y) => x === y)
      .map(o => ({ t: o.t, x: o.t === 'del' ? o.a : o.b }));
  }

  const api = {
    TEXTOS, LEYENDA_NC, ANEXOS_TITULO, ANEXOS_DOCS, ANEXOS_ENSAYOS_TITULO, ENSAYOS_POR_DEFECTO, COLUMNAS_PAA,
    mantenimiento, resultados, localizacion, estructura, huella, diffBloques, diffPalabras,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PLANTILLA_INFORME = api;
})(typeof window !== 'undefined' ? window : this);

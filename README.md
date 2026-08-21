# Super Miau

Juego de plataformas 2D desarrollado con HTML, CSS, JavaScript y Canvas. Incluye siete mundos, secciones internas, combates, cinemáticas MP4, fondos progresivos, controles táctiles y una versión Android completamente offline.

## Un proyecto de 4.º grado

**Super Miau** fue creado por los niños y las niñas de **4.º grado de la Escuela N.º 3 “Justo José de Urquiza”**. Todo el grado aportó ideas, personajes, desafíos e imaginación para construir la historia y el desarrollo del juego.

La **Seño Cami** fue la orquestadora del proyecto: acompañó al grupo, reunió sus propuestas y ayudó a convertirlas en una aventura jugable. El resultado es una creación colectiva en la que cada integrante del grado dejó su huella.

## Estado actual

- Pantalla inicial adaptable, legible y preparada para pantalla completa.
- Cinemática inicial formada por `cinematica1.mp4`, `cinematica2.mp4` y `cinematica3.mp4`, con fundidos de imagen y audio.
- Fondos por fotogramas y capas progresivas cargados bajo demanda.
- Recuperación segura en los puentes: Miau vuelve a suelo firme y los tablones se regeneran.
- Vampiro con bandadas recurrentes equilibradas y ataque mediante aerosol.
- Vuelo y combate sobre el dragón durante el asalto a la fortaleza.
- Batalla final de Firulais en tres fases y tres barras de vida, rescate familiar y salida por el portal.
- Probador de niveles superpuesto, desplazable y accesible con teclado.
- Recursos, estilos y videos locales: la APK no necesita Internet.
- Paquetes independientes para Vercel y Android.

## La aventura

Super Miau atraviesa siete mundos para rescatar a su familia y regresar a casa:

1. Parque Sureño.
2. Bosque de los Ecos.
3. Colonia Colosal.
4. Ciudad Sumergida.
5. Cordillera de las Siete Huellas.
6. Fortaleza de Firulais.
7. Dimensión Quebrada.

Los mundos contienen varias etapas, jefes, poderes y mecánicas propias. Al perder todas las vidas, la partida vuelve al nivel `.1` del mundo alcanzado en lugar de reiniciar toda la aventura. La batalla de Firulais conduce al rescate familiar, el cierre animado del portal y los créditos dedicados al grupo creador.

## Controles

| Acción | Teclado | Pantalla táctil |
| --- | --- | --- |
| Caminar | `A` / `D` o flechas | Botones izquierdo y derecho |
| Saltar o subir | `W`, flecha arriba o espacio | Botón Saltar |
| Bajar, nadar o acción especial | `S` o flecha abajo | Botón inferior contextual |
| Disparar o usar poder | `F` o `Shift` | Botón Estelar |
| Pausar | `P` o `Esc` | Botón de pausa |

Algunas acciones cambian según el mundo: nadar, esconderse, montar al dragón o utilizar poderes especiales. La interfaz muestra el botón correspondiente cuando está disponible.

## Requisitos de desarrollo

- Node.js 20 o posterior.
- `npm install` para instalar Tailwind y Capacitor.
- Android Studio, Android SDK 35 y Java 21 para generar la APK.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí <http://127.0.0.1:8000>. También se puede probar una sección directamente:

```text
http://127.0.0.1:8000/?level=6.2
```

El modo desarrollador se muestra con `Ctrl + Shift + D`, se cierra con `Esc` y el HUD técnico se activa con `F3`.

## Validación

```bash
npm test
```

La validación controla la sintaxis y el orden de los módulos, recursos locales faltantes, extensiones admitidas, IDs HTML duplicados y la declaración UTF-8.

## Versión web y Vercel

```bash
npm run vercel:build
```

La versión estática se genera en `dist/vercel/`. El paquete compartible queda en `dist/SuperMiau-vercel.zip` después de generar el ZIP de entrega. Vercel también puede publicar la raíz del repositorio; `.vercelignore` excluye Android, dependencias y artefactos de desarrollo.

Para generar una versión web offline destinada a Capacitor:

```bash
npm run web:build
```

El contenido queda en `www/`. No se debe editar esa carpeta manualmente: cada compilación la reemplaza con el estado actual de los archivos fuente.

## APK Android offline

```bash
npm run apk:debug
```

El comando compila Tailwind, crea la web offline, sincroniza Capacitor, compila Android y copia el resultado a `dist/SuperMiau-offline-debug.apk`.

La APK de depuración está firmada para instalación directa durante pruebas y presentaciones. Para publicar en una tienda se necesita una firma de lanzamiento propia.

Después de cualquier cambio en el juego hay que volver a ejecutar `npm run apk:debug`; de ese modo la APK y la versión web contienen exactamente los mismos niveles, textos, imágenes y correcciones.

## Salidas disponibles

| Opción | Uso | Resultado |
| --- | --- | --- |
| Servidor local | Desarrollo y revisión rápida | `http://127.0.0.1:8000` |
| Web/Vercel | Publicación para navegadores | `dist/vercel/` |
| APK Android | Instalación offline en celulares y tablets | `dist/SuperMiau-offline-debug.apk` |

## Estructura

```text
super-miau/
├── android/                 Proyecto nativo de Capacitor
├── assets/
│   ├── backgrounds/         Fondos y fotogramas de niveles
│   ├── logos/
│   └── sprites/             Personajes, enemigos y poses
├── cinematicas/             Tres videos del prólogo
├── css/
│   ├── styles.css
│   └── tailwind.generated.css
├── docs/
│   ├── ANDROID.md
│   └── ARCHITECTURE.md
├── js/
│   ├── audio.js
│   ├── config.js
│   ├── data/levels.js
│   ├── render/
│   │   ├── backgrounds.js
│   │   ├── effects.js
│   │   ├── entities.js
│   │   └── hud.js
│   └── game.js
├── scripts/                 Validación y empaquetado
├── index.html
├── capacitor.config.json
├── package.json
├── tailwind.config.js
└── vercel.json
```

## Rendimiento y mantenimiento

- El canvas conserva una resolución lógica de 800 × 450 y escala mediante CSS sin deformarse.
- Los fondos progresivos pesados se cargan cuando el nivel los necesita y se anticipa el siguiente fotograma.
- Las entidades fuera de cámara no se dibujan y las partículas tienen límites de seguridad.
- La calidad de sombras y efectos se adapta al rendimiento medido.
- Los videos se pausan al cambiar de aplicación o pestaña.
- La antigua cinemática canvas fue retirada para evitar código y procesamiento duplicados.

Antes de una presentación conviene probar la APK en el dispositivo definitivo, activar pantalla completa y recorrer especialmente los niveles 3.3, 5.3, 6.1 y 6.2.

## Créditos

- **Creación colectiva, historia y desarrollo:** niños y niñas de 4.º grado.
- **Escuela:** Escuela N.º 3 “Justo José de Urquiza”.
- **Orquestación y acompañamiento del proyecto:** Seño Cami.

Hecho con creatividad, compañerismo y la imaginación de todo el grado.

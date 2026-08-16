# Super Miau

Juego de plataformas 2D desarrollado con HTML, CSS y JavaScript, sin dependencias de ejecución ni proceso de compilación.

## Requisitos

- Node.js 18 o posterior para el servidor y las validaciones locales.
- Conexión a Internet para Tailwind CSS y la fuente Fredoka.

## Desarrollo local

```bash
npm run dev
```

Abrí <http://127.0.0.1:8000>. El servidor desactiva la caché para que los cambios sean visibles al recargar.

## Validación

```bash
npm test
```

El comando controla la sintaxis de JavaScript, la codificación declarada y la existencia de los recursos enlazados desde `index.html`.

## Estructura

```text
super-miau/
├── assets/
│   ├── backgrounds/
│   ├── logos/
│   └── sprites/
├── css/
│   └── styles.css
├── docs/
│   └── ARCHITECTURE.md
├── js/
│   ├── audio.js
│   ├── config.js
│   ├── data/
│   │   └── levels.js
│   ├── render/
│   │   ├── effects.js
│   │   ├── backgrounds.js
│   │   ├── entities.js
│   │   └── hud.js
│   └── game.js
├── scripts/
│   ├── serve.mjs
│   └── validate.mjs
├── index.html
├── package.json
└── vercel.json
```

La explicación técnica y el plan de modularización están en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Publicación

El proyecto es estático y puede publicarse directamente en Vercel. `vercel.json` mantiene URLs limpias y no se requiere un comando de build.

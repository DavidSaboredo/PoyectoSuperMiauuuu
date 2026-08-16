# Super Miau V23

Versión organizada del juego para editar en Visual Studio Code, subir a GitHub y publicar en Vercel.

## Abrir y probar en VS Code

1. Descomprimí el archivo ZIP.
2. Abrí Visual Studio Code.
3. Elegí **Archivo > Abrir carpeta** y seleccioná `super-miau-v23-vscode`.
4. Abrí `index.html`.
5. Para probar el juego, usá la extensión **Live Server** y elegí **Open with Live Server**.

El juego usa Tailwind CSS y la fuente Fredoka desde Internet. Por eso conviene probarlo con conexión.

## Organización

```text
super-miau-v23-vscode/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── audio.js
│   └── game.js
├── assets/
│   ├── backgrounds/
│   ├── logos/
│   └── sprites/
├── .vscode/
│   └── extensions.json
├── .gitignore
├── vercel.json
└── README.md
```

- `index.html`: pantallas, botones, textos y estructura del juego.
- `css/styles.css`: diseño visual y adaptación a celulares.
- `js/audio.js`: sonidos generados por el navegador.
- `js/game.js`: niveles, físicas, enemigos, portales y mecánicas.
- `assets/sprites`: las ocho poses de Super Miau.
- `assets/backgrounds`: ilustración de Juan Perón y Puerto Viejo.
- `assets/logos`: escudo usado en las banderas de Parque Sur.

## Mundo 3 incluido

- 3.1: bichos gigantes y telarañas que atrapan durante 5 segundos.
- 3.2: túnel subterráneo, topos vigilantes y agujeros para esconderse.
- 3.3: lianas, combate y puentes cuyas tablas caen en secuencia.

Para encontrar rápidamente esta parte en VS Code, buscá `Mecánicas exclusivas de 3.1, 3.2 y 3.3` dentro de `js/game.js`.

## Subir a GitHub

Desde la terminal de VS Code, dentro de esta carpeta:

```bash
git init
git add .
git commit -m "Super Miau V23"
git branch -M main
git remote add origin URL-DE-TU-REPOSITORIO
git push -u origin main
```

Si el repositorio ya estaba creado y clonado, copiá estos archivos dentro de él y usá solamente:

```bash
git add .
git commit -m "Actualizar Super Miau a V23"
git push
```

No subas el ZIP al repositorio: subí la carpeta descomprimida para que GitHub pueda mostrar cada archivo y cada cambio.

## Publicar en Vercel

Importá el repositorio en Vercel. No necesita comando de instalación ni de compilación: `vercel.json` publica el proyecto como sitio estático.


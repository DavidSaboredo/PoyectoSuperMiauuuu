# Super Miau

`Super Miau` es un juego de aventura hecho en un solo archivo web. Controlas a un gatito valiente que viaja por mundos diferentes para rescatar a su familia, juntar huellas brillantes y vencer enemigos raros.

## ¿Qué hace este proyecto?
- Muestra una historia inicial con una cinematica dibujada en pantalla.
- Te deja mover a `Miau`, saltar, nadar, pausar, disparar poderes y visitar una tienda.
- Cambia de mundo en mundo con escenarios distintos: parque, bosque, colonia de bichos, lava, agua, castillo y una dimension final.
- Guarda parte del progreso en tu computadora para que no pierdas tus huellas y mejoras.

## Controles rapidos
- Moverse: Flechas ⬅️➡️ o `A`/`D`
- Saltar: Flecha ⬆️ o `W` o `Espacio`
- Maullido Estelar (cuando tengas ⭐): `F` o `Shift`
- Nivel 5 (agua): bajar con Flecha ⬇️ o `S`
- Pausa: `P` o `Escape`
- Pantalla completa: boton `⛶` (arriba) o `⛶ Pantalla Completa` (en movil)

## ¿Cómo funciona por dentro?
- **La pantalla principal**:
  Cuando abres `index.html`, el juego muestra el menu, la tienda y los botones para empezar.
- **La cinematica**:
  Antes de jugar, aparece una escena animada. No usa video: todo se dibuja con codigo en un lienzo (`canvas`), como si el programa estuviera pintando cuadro por cuadro.
- **El jugador**:
  `Miau` tiene posicion, velocidad, vidas, poderes y monedas. El codigo actualiza esos datos muchas veces por segundo para que parezca que se mueve de verdad.
- **Los niveles**:
  Cada nivel tiene un plano con suelo, plataformas, premios y enemigos. El juego lee ese plano y construye el mundo automaticamente.
- **Los enemigos**:
  No todos hacen lo mismo. Algunos patrullan, otros cargan, otros saltan, otros flotan y algunos tienen mas vida que otros.
- **La fisica**:
  El juego revisa si `Miau` toca el suelo, si golpea bloques, si cae, si nada o si choca con enemigos.
- **El dibujo**:
  En cada frame el programa pinta el fondo, los bloques, los enemigos, el jugador, los efectos y la interfaz.
- **El guardado**:
  Algunas cosas se guardan con `localStorage`, que es una cajita del navegador donde se pueden recordar datos entre una partida y otra.

## ¿Qué necesito para usarlo?
- Una computadora con navegador moderno.
- Conexion a internet, porque esta version web usa `Tailwind` y fuentes externas para verse completa.
- Opcional: `Python` si quieres abrir el juego con un servidor local sencillo.

## ¿Cómo lo puedo ejecutar en mi computadora?
### Opcion 1: abrir el archivo
1. Busca el archivo `index.html`.
2. Haz doble clic.
3. El navegador abrira el juego.

### Opcion 2: abrirlo con servidor local
1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta este comando:

```bash
py -m http.server 8000
```

3. Abre el navegador en `http://localhost:8000/`.
4. Entra a `index.html` si no abre automaticamente.

## ¿Cómo lo subo a Vercel?
- Sube esta carpeta a un repositorio o importala directamente en Vercel.
- Vercel detectara el proyecto como sitio estatico.
- El archivo `vercel.json` ya deja una configuracion simple para servir el juego como web limpia.
- Si todo sale bien, `index.html` sera la entrada principal del juego.

## ¿Que archivos quedaron en el proyecto?
- `index.html`: el juego completo.
- `README.md`: esta guia.
- `Super_Miau_Android.apk`: una version empaquetada para Android (no es necesaria para Vercel y puede quedar fuera del repo).
- `vercel.json`: configuracion minima para desplegar el juego en Vercel.

## Ideas divertidas para modificar el juego
- Cambia los colores de un mundo para inventar una nueva dimension.
- Haz que un enemigo sea mas rapido o mas lento.
- Agrega mas plataformas y esconde huellas en lugares secretos.
- Cambia los textos de la cinematica y crea otra historia.
- Prueba nuevos poderes para `Miau`, como un doble salto o un escudo mas largo.

## Consejos para chicos curiosos
- Lee el codigo por partes, no todo de una vez.
- Empieza buscando palabras faciles de reconocer, como `startGame`, `initLevel` o `renderGame`.
- Si cambias algo pequeño y pruebas enseguida, sera mas facil entender que paso.
- Si algo se rompe, no te asustes: vuelve atras y prueba un cambio mas pequeño.
- La parte mas creativa del proyecto suele estar en los niveles, los enemigos, los colores y la historia.

## Para quien quiera aprender mas
- `initLevel()` arma el mapa.
- `updateGame()` hace que todo se mueva y choque.
- `renderGame()` dibuja lo que ves.
- `loop()` repite el juego una y otra vez para que se sienta vivo.

Este proyecto esta pensado para aprender jugando: puedes mirar el codigo, cambiar cosas y descubrir como una idea se convierte en una aventura interactiva.

# Arquitectura de Super Miau

## Estructura

- `index.html`: estructura de pantallas, HUD y canvas.
- `css/styles.css`: presentación general y adaptación responsive.
- `js/audio.js`: sintetizador y efectos sonoros.
- `js/config.js`: constantes compartidas de física, movimiento y escenario.
- `js/data/levels.js`: geometría, objetos, enemigos y coleccionables de cada sección.
- `js/render/backgrounds.js`: fondos atmosféricos y escenografía del parque y la calle.
- `js/render/entities.js`: render del jugador y entidades móviles de la calle.
- `js/render/hud.js`: contadores, poderes, métricas de depuración y HUD de combate.
- `js/render/effects.js`: partículas, sacudidas y primitivas compartidas de canvas.
- `js/game.js`: estado, niveles, actualización y renderizado.
- `assets/`: imágenes organizadas por función.
- `scripts/`: servidor local y controles automáticos del proyecto.

## Flujo del juego

`index.html` carga primero el audio y luego el motor. El bucle principal actualiza el estado en pasos de física y renderiza sobre un canvas de 800 × 450. Los planos de niveles son datos declarativos dentro de `game.js`.

## Evolución segura

`game.js` conserva variables globales compartidas. Dividirlo de una sola vez tendría un riesgo alto; la modularización debe hacerse por etapas:

1. Extraer constantes sin cambiar sus valores. *(Completado)*
2. Extraer planos de niveles sin cambiar sus valores. *(Completado)*
3. Extraer renderizadores puros que sólo reciban contexto y estado. *(Fondos, entidades, HUD y efectos completados)*
4. Encapsular audio, entrada y almacenamiento.
5. Centralizar el estado mutable en un objeto de sesión.
6. Añadir pruebas de física y transiciones antes de separar el bucle principal.

Cada etapa debe mantener `npm test` en verde y probar manualmente las transiciones entre secciones.

## Limpieza técnica

El renderizador legado e inalcanzable de la calle 1.3 fue eliminado. Las versiones visuales históricas que todavía son funciones completas se conservan hasta confirmar si alguna sirve como fallback o referencia para otros fondos.

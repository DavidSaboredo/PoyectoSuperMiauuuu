# Arquitectura de Super Miau

## Capas principales

- `index.html`: pantallas, HUD, controles, video y canvas.
- `css/styles.css`: diseño propio, adaptación responsive y pantalla completa.
- `js/config.js`: constantes compartidas de física y rendimiento.
- `js/data/levels.js`: planos declarativos, plataformas, enemigos y coleccionables.
- `js/audio.js`: música y efectos sintetizados.
- `js/render/backgrounds.js`: fondos, parallax y secuencias progresivas.
- `js/render/effects.js`: partículas y primitivas visuales.
- `js/render/entities.js`: jugador y entidades móviles.
- `js/render/hud.js`: interfaz de partida, jefes y diagnóstico.
- `js/game.js`: estado mutable, actualización, colisiones y flujo entre niveles.

## Flujo de ejecución

1. El HTML carga configuración, datos y renderizadores antes de `game.js`.
2. El prólogo reproduce tres videos locales en secuencia.
3. `initLevel()` construye el mundo desde el plano activo.
4. El bucle usa pasos fijos de física y un render por cuadro.
5. Los renderizadores descartan elementos fuera de cámara.
6. Las transiciones limpian colecciones temporales antes de construir la siguiente sección.

## Recursos visuales

Los sprites de acciones se reutilizan desde cachés de `Image`. Los fondos progresivos utilizan carga diferida: no reciben `src` hasta ser necesarios. Durante una mezcla se solicita también el siguiente fotograma para evitar cortes visibles.

Las cinemáticas viven en `cinematicas/` y se copian tanto a `www/` como a `dist/vercel/` durante la compilación.

## Recuperación de estado

Cada inicio de nivel vacía proyectiles, partículas peligrosas y estados exclusivos de la sección anterior. En 3.3 los puntos de reaparición corresponden a islas firmes y `restoreFallingPlatforms()` recompone los tablones. En 5.2 la misma restauración se aplica a las piedras de lava.

## Presupuesto de rendimiento

- Resolución lógica de 800 × 450.
- Física con acumulador y límite de recuperaciones por cuadro.
- Descarte horizontal antes de dibujar entidades.
- Límites de partículas y efectos ambientales.
- Sombras adaptables según la calidad de ejecución.
- Fondos grandes bajo demanda.
- Video pausado cuando el documento queda oculto.

## Próximas separaciones seguras

`game.js` sigue concentrando el estado y las reglas de interacción. Las siguientes extracciones recomendadas son entrada y controles, almacenamiento/tienda, controlador de pantallas, mecánicas por mundo y estado de sesión centralizado.

Cada extracción debe conservar las variables públicas consumidas por los renderizadores y mantener `npm test` en verde.

# APK Android sin conexion

La carpeta `android/` contiene el proyecto nativo de Capacitor. Tailwind, imagenes, scripts y fondos quedan incluidos dentro de la aplicacion, por lo que el juego no necesita Internet durante la presentacion.

## Generar el APK

Instala Android Studio con su SDK y JDK. Despues ejecuta desde la raiz del proyecto:

```bash
npm run apk:debug
```

El resultado queda en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Como alternativa, ejecuta `npm run android:open` y elige **Build > Build APK(s)** en Android Studio.

Cada vez que cambie el juego, `npm run apk:debug` vuelve a compilar Tailwind, copia todos los recursos y sincroniza Android antes de construir el APK.

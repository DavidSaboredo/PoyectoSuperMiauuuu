import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const androidDir = join(root, 'android');
const windowsUserRoot = process.env.LOCALAPPDATA
    ? resolve(process.env.LOCALAPPDATA, '..', '..')
    : root;
const gradleUserHome = join(windowsUserRoot, '.gradle');

const javaHomes = [
    process.env.JAVA_HOME,
    'C:\\Program Files\\Microsoft\\jdk-21.0.12.1-hotspot',
    join(tmpdir(), 'supermiau-jdk21', 'jdk-21.0.12.1+1')
].filter(Boolean);

const javaHome = javaHomes.find(candidate => existsSync(join(candidate, 'bin', 'java.exe')));
if (!javaHome) {
    throw new Error('No se encontró Java 21. Instalalo o definí JAVA_HOME antes de compilar.');
}

const java = join(javaHome, 'bin', 'java.exe');
const wrapperJar = join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.jar');
const result = spawnSync(java, [
    `-Dorg.gradle.java.home=${javaHome}`,
    `-Dgradle.user.home=${gradleUserHome}`,
    '-classpath', wrapperJar,
    'org.gradle.wrapper.GradleWrapperMain',
    'assembleDebug'
], { cwd: androidDir, stdio: 'inherit' });

if (result.status !== 0) process.exit(result.status ?? 1);

const sourceApk = join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const outputDir = join(root, 'dist');
const outputApk = join(outputDir, 'SuperMiau-offline-debug.apk');
await mkdir(outputDir, { recursive: true });
await cp(sourceApk, outputApk);

console.log(`APK listo: ${outputApk}`);

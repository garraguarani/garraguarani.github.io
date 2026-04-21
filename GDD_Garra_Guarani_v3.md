# 🎮 GDD — Garra Guaraní v4.0 (Edición Final 2026)
## Documento de Diseño y Especificaciones Técnicas — Mobile Vertical Shooter
**Fecha:** 21 de Abril de 2026

---

## 🧾 1. Resumen Ejecutivo

- **Nombre:** Garra Guaraní
- **Género:** Vertical Scrolling Shoot'em Up (estilo Raptor: Call of the Shadows)
- **Estilo Visual:** Pixel Art 16-bit retro
- **Tecnología:** HTML5 Canvas + Vanilla JavaScript (PWA)
- **Estado Actual:** Lanzamiento Interno v10 (Estable)

### Elevator Pitch
Un vertical shooter donde controlás a un futbolista paraguayo que dispara pelotas contra rivales mundialistas. Las comidas típicas otorgan armas poderosas. La progresión sigue el fixture real del Mundial 2026.

---

## 🏗️ 2. Arquitectura del Proyecto (File Structure)

El proyecto sigue una estructura modular orientada a sistemas y entidades:

```text
GarraGuarani/
├── index.html              # Punto de entrada y estructura DOM
├── sw.js                   # Service Worker (Caché v10)
├── manifest.json           # Configuración PWA
├── assets/                 # Recursos (Imágenes, Sonidos)
└── js/                     # Lógica principal del juego
    ├── main.js             # Punto de entrada, Loop y Máquina de Estados
    ├── config.js           # Constantes globales y configuración
    ├── renderer.js         # Motor de renderizado y escalado de Canvas
    ├── systems/            # Motores de apoyo
    │   ├── audio.js        # Audio Engine v4.0 (Master Gain, SFX)
    │   ├── input.js        # Gestión de Touch y Teclado
    │   ├── particles.js    # Sistema de partículas y efectos visuales
    │   └── weather.js      # Sistema de clima dinámico (Lluvia, Niebla)
    ├── entities/           # Clases de objetos de juego
    │   ├── player.js       # Mecánicas del jugador y Garra Guaraní
    │   ├── enemy.js        # Comportamiento de rivales básicos
    │   ├── boss.js         # Lógica de Jefes Finales
    │   ├── bullet.js       # Gestión de proyectiles
    │   └── powerup.js      # Sistema de items (Comidas Típicas)
    ├── screens/            # Pantallas de la interfaz (UI)
    │   ├── menu.js         # Pantalla Principal
    │   ├── level-select.js # Fixture y selección de niveles
    │   ├── shop.js         # Tienda de mejoras
    │   └── common/         # Pantallas de GameOver y Victoria
    └── data/               # Definición de datos (JSON-like)
        ├── levels.js       # Configuración de oleadas y niveles
        ├── enemies.js      # Atributos de cada tipo de enemigo
        └── weapons.js      # Niveles de armas y daño
```

---

## ⚙️ 3. Sistemas Técnicos Principales

### 3.1 Loop de Juego (main.js)
El corazón del juego es un `requestAnimationFrame` que utiliza un **Delta Time (dt)** para asegurar que el movimiento sea consistente a 60fps independientemente del dispositivo.

### 3.2 Máquina de Estados
El flujo de navegación se gestiona mediante estados discretos:
- `MENU`, `LEVEL_SELECT`, `PLAYING`, `SHOP`, `GAME_OVER`, `VICTORY`, `CONTROLS`.

### 3.3 Motor de Audio v4.0 (audio.js)
Implementado con **Web Audio API**. 
- **Master Gain Node**: Permite un silenciado instantáneo de todo el audio (SFX y ambiente).
- **Música (BGM)**: Desactivada totalmente a petición del usuario para optimizar la experiencia de juego.
- **Sintetizador**: Utiliza osciladores dinámicos para los SFX (sine, square, sawtooth), evitando el peso de archivos .mp3.

### 3.4 Motor de Renderizado (renderer.js)
- **Escalado Inteligente**: Escala el canvas manteniendo el aspect ratio original (9:16) para cualquier tamaño de pantalla móvil.
- **Pixel Perfect**: Desactiva el suavizado de imagen (`imageSmoothingEnabled = false`) para preservar la estética Pixel Art.

---

## 🎮 4. Gameplay y Mecánicas

### Movimiento
- **Mobile**: Sistema de arrastre relativo. El jugador no tiene que estar justo debajo del dedo, evitando tapar la visión.
- **Desktop**: WASD y Flechas.

### Progresión (Fixture Real)
El juego incluye 7 niveles que recorren el camino de Paraguay en el Mundial 2026:
1. vs 🇺🇸 USA
2. vs 🇹🇷 Turquía
3. vs 🇦🇺 Australia (Boss: Capitán Australiano)
4. Octavos de Final
5. Cuartos de Final
6. Semifinal
7. Gran Final (Boss Final aleatorio entre potencias).

### Sistema de Armas
Sistema dual inspirado en clásicos:
- **Always Active**: Pelota Básica, Fuego (Asado), Triple (Chipa).
- **Selectable**: Guiada (Tereré), Bomba (Sopa Paraguaya).
- **Special**: Mega Gol (Vori Vori).

---

## 🚀 5. Optmización y Persistencia

- **PWA (sw.js)**: El juego funciona offline gracias al Service Worker. Se utiliza la versión **v10** para forzar la actualización de archivos JS y assets.
- **LocalStorage**: Guarda el progreso de niveles desbloqueados y los Guaraníes (₲) acumulados por el usuario.
- **Correcciones Visuales (Flip)**: Los enemigos y jefes se renderizan con un volteo vertical (`scale(1, -1)`) para asegurar que aparezcan parados derecho hacia el jugador.

---

## 📅 6. Estado Final al 21/04/2026

- **Música**: Removida completamente.
- **Arte**: Integración de jefes finales para todos los niveles y sprites personalizados de Árbitro e Hincha (tamaño extra grande).
- **Interfaz**: Menú limpio sin artefactos visuales, botones funcionales y muteo real.

---
**Documento Oficial Garra Guaraní — 2026**

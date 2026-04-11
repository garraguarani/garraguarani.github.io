# 🎮 GDD — Garra Guaraní v3.0
## Documento de Diseño de Videojuego — Mobile Vertical Shooter

---

## 🧾 1. Resumen Ejecutivo

- **Nombre:** Garra Guaraní
- **Género:** Vertical Scrolling Shoot'em Up (estilo Raptor: Call of the Shadows)
- **Modo:** Single Player
- **Estilo Visual:** Pixel Art 16-bit retro
- **Tecnología:** HTML5 Canvas + Vanilla JavaScript (PWA)
- **Plataforma:** Mobile-first (touch), compatible desktop
- **Distribución:** Link web (WhatsApp), futuro Google Play (TWA)
- **Monetización:** 100% gratis + Ads en pantallas intermedias

### Elevator Pitch
Un vertical shooter estilo Raptor donde controlás a un futbolista paraguayo que dispara pelotas de fútbol contra oleadas de rivales mundialistas. Las comidas típicas paraguayas otorgan armas cada vez más poderosas. La progresión sigue el fixture real del Mundial 2026: desde la fase de grupos hasta la final. ¡Pura garra, puro Paraguay! 🇵🇾

---

## 🎯 2. Visión del Juego

**Objetivo:** Crear un juego mobile gratuito, adictivo y viral que celebre la clasificación de Paraguay al Mundial 2026 después de 16 años.

**Experiencia deseada:**
- Orgullo e identidad paraguaya inmediata
- Sesiones cortas (3-5 min por nivel) perfectas para mobile
- Progresión satisfactoria con sistema de tienda
- Altamente compartible por WhatsApp

---

## 🧱 3. Core Pillars

1. **Identidad Paraguaya** — Arte, comida, música y espíritu albirrojo en cada pixel
2. **Arcade Adictivo** — Gameplay simple de entender, difícil de dominar
3. **Progresión Mundial** — El fixture real del torneo como estructura narrativa
4. **Mobile-First** — Diseñado para jugar con un solo dedo en el celular

---

## 🎮 4. Gameplay

### Loop Principal
```
Menú → Seleccionar Nivel (Fixture) → Jugar Nivel → Boss Fight → 
Victoria + Ad → Tienda (gastar ₲) → Siguiente Nivel → ... → Final
```

### Controles
- **Touch (mobile):** Arrastrar el dedo para mover al jugador. El jugador sigue la posición relativa del dedo. Auto-fire siempre activo.
- **Teclado (desktop):** WASD/Flechas para mover. Espacio/disparo automático. Q para cambiar arma. E para Garra Guaraní.
- **Botones HUD:** Cambiar arma selectable (tap), activar Garra Guaraní (tap)

### Pantalla de Juego
```
┌─────────────────────┐
│  ₲12,500  ❤❤❤  🏆3 │  ← HUD superior
│                     │
│    ↓ enemigos ↓     │
│   👕  👕  👕  👕    │
│      👕  👕         │
│                     │
│         ⚽↑         │  ← Pelotas (disparos)
│         ⚽↑         │
│                     │
│     🇵🇾 Jugador     │  ← Zona del jugador (~40% inferior)
│                     │
│  [ArmaActual] [🔥]  │  ← Botones HUD inferior
└─────────────────────┘
```

---

## 🧑 5. Jugador (El Futbolista)

- **Sprite:** Futbolista paraguayo visto desde arriba/atrás con camiseta albirroja (#CE1126 rojo, blanco)
- **Movimiento:** Libre en X e Y, restringido al ~60% inferior de la pantalla
- **Vida:** 100 puntos (barra de vida en HUD)
- **Auto-fire:** Dispara automáticamente mientras está en juego
- **Hitbox:** Más pequeña que el sprite visual (fair play)

---

## ⚽ 6. Sistema de Armas (Pelotas)

Inspirado en el sistema dual de Raptor (Always Active + Selectable):

### Armas Always Active (disparan simultáneamente)
| Nivel | Arma | Power-Up | Descripción |
|-------|------|----------|-------------|
| 0 | **Pelota Básica** | Default | 1 disparo recto, daño bajo |
| 1 | **Pelota de Fuego** | Asado 🥩 | Atraviesa enemigos, daño medio |
| 2 | **Triple Pelota** | Chipa 🫓 | 3 disparos en abanico (spread) |

### Armas Selectable (solo 1 activa)
| Arma | Power-Up | Descripción |
|------|----------|-------------|
| **Pelota Guiada** | Tereré 🧉 | Auto-tracking al enemigo más cercano |
| **Pelota Bomba** | Sopa Paraguaya 🥧 | Explota en área de efecto al impactar |

### Arma Especial
| Arma | Power-Up | Descripción |
|------|----------|-------------|
| **Mega Gol** | Vori Vori 🍜 | Limpia TODA la pantalla. Máximo 3 en inventario. |

### Mecánicas de Armas
- Recoger el mismo power-up **mejora el nivel** del arma (más daño, más proyectiles)
- Máximo nivel 3 por arma
- Al morir, se pierden las armas (empezás con básica)
- Las armas se pueden comprar/mejorar en la tienda

---

## 👕 7. Enemigos (Rivales)

Cada selección tiene colores de camiseta distintos pero comparten tipos base:

### Básicos
| Tipo | Comportamiento | Vida | Puntos |
|------|---------------|------|--------|
| **Corredor** | Baja en línea recta, disparo simple | 1 hit | 100₲ |
| **Driblador** | Baja en zigzag, sin disparo | 2 hits | 150₲ |
| **Lateral** | Entra por los costados en diagonal | 1 hit | 120₲ |

### Intermedios
| Tipo | Comportamiento | Vida | Puntos |
|------|---------------|------|--------|
| **Defensor** | Avanza lento, mucha vida, bloquea brevemente | 5 hits | 300₲ |
| **Mediocampista** | Dispara ráfagas de 3, movimiento errático | 3 hits | 250₲ |
| **Portero** | Escudo frontal, vulnerable por los lados | 4 hits | 350₲ |

### Avanzados
| Tipo | Comportamiento | Vida | Puntos |
|------|---------------|------|--------|
| **10 Rival** | Disparo múltiple, rápido, esquiva | 4 hits | 500₲ |
| **Director Técnico** | Buff a enemigos cercanos (+velocidad), huye | 6 hits | 600₲ |

---

## 👑 8. Jefes (Capitanes)

Un jefe al final de cada nivel. Cada jefe tiene:
- Barra de vida visible en la parte superior
- 3 fases con patrones de ataque distintos
- Patrones aprendibles pero desafiantes
- Drop de créditos bonus al morir

### Jefes de Fase de Grupos
| Nivel | Rival | Temática del Boss |
|-------|-------|-------------------|
| 1 | 🇺🇸 USA | Disparo spread + cargas laterales |
| 2 | 🇹🇷 Turquía | Patrones circulares + escudos rotativos |
| 3 | 🇦🇺 Australia | Velocidad alta + ataques diagonales |

### Jefes de Eliminatorias (Niveles 4-6)
- Generados con dificultad creciente
- Combinan patrones de los jefes anteriores
- Más vida, más velocidad, más proyectiles

### Boss Final (Nivel 7)
- Seleccionado aleatoriamente entre: 🇪🇸 España, 🇫🇷 Francia, 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra, 🇦🇷 Argentina, 🇧🇷 Brasil
- 4 fases (en vez de 3)
- Patrón especial único según selección
- Escena de victoria épica al derrotarlo

---

## 💰 9. Sistema de Créditos / Tienda

### Moneda: Guaraníes (₲)
- Se obtienen al destruir enemigos
- Bonus por completar nivel sin morir
- Bonus por usar modo Garra Guaraní

### Tienda (entre niveles)
| Item | Precio | Efecto |
|------|--------|--------|
| Mejorar arma activa | 500-2000₲ | +1 nivel de arma |
| Comprar arma nueva | 1500₲ | Desbloquea arma |
| Mega Gol x1 | 800₲ | +1 screen clear |
| Escudo Extra | 1000₲ | +25 vida máxima |
| Restaurar Vida | 300₲ | Vida al 100% |
| Imán de Power-ups | 600₲ | Power-ups se atraen al jugador (1 nivel) |

---

## 🌎 10. Estructura / Progresión

### Fixture del Mundial 2026 — Grupo D

```
FASE DE GRUPOS:
├── Nivel 1: 🇵🇾 vs 🇺🇸 USA          (12 junio — Los Ángeles)
├── Nivel 2: 🇵🇾 vs 🇹🇷 Turquía       (19 junio — San Francisco)
└── Nivel 3: 🇵🇾 vs 🇦🇺 Australia     (25 junio — San Francisco)

OCTAVOS DE FINAL:
└── Nivel 4: 🇵🇾 vs Rival aleatorio

CUARTOS DE FINAL:
└── Nivel 5: 🇵🇾 vs Rival aleatorio

SEMIFINAL:
└── Nivel 6: 🇵🇾 vs Rival aleatorio

FINAL:
└── Nivel 7: 🇵🇾 vs ??? (aleatorio entre los 5 favoritos)
```

### Pool de Rivales para Final
| Selección | Probabilidad real (abril 2026) |
|-----------|-------------------------------|
| 🇪🇸 España | ~16% |
| 🇫🇷 Francia | ~14% |
| 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra | ~11% |
| 🇦🇷 Argentina | ~9% |
| 🇧🇷 Brasil | ~8% |

---

## 🔥 11. Modo "Garra Guaraní"

- **Barra de carga:** Se llena al eliminar enemigos y recoger power-ups
- **Activación:** Tap en botón especial (o doble-tap en pantalla)
- **Duración:** 5 segundos
- **Efectos:**
  - Invencibilidad total
  - Todas las armas al máximo poder
  - Pantalla con efecto red/white (colores albirrojos)
  - Partículas épicas
  - Sonido de estadio paraguayo rugiendo
- **Cooldown:** No se puede acumular, la barra se reinicia

---

## 🎨 12. Arte y Estilo Visual

- **Estilo:** Pixel Art 16-bit retro
- **Paleta principal:** Rojo (#CE1126), Blanco (#FFFFFF), Azul (#0038A8) — bandera paraguaya
- **Resolución lógica:** 360×640 (portrait, ratio 9:16)
- **Sprites:** 16×16 a 32×32 pixels para entidades, 64×64 para bosses
- **Fondos:** Parallax scrolling multi-capa (cielo/estadio/cancha)
- **Efectos:** Partículas pixel (explosiones, chispas, estrellas)

---

## 🔊 13. Audio

- **Música:** Chiptune con ritmo de estadio paraguayo
- **SFX:**
  - Disparo de pelota
  - Impacto/explosión
  - Recoger power-up
  - Daño recibido
  - Boss aparece
  - Gol (Mega Gol)
  - Modo Garra Guaraní activado
  - Victoria de nivel
  - Game Over

---

## 📱 14. Especificaciones Técnicas

| Aspecto | Especificación |
|---------|---------------|
| Motor | HTML5 Canvas 2D + Vanilla JavaScript |
| Formato | Progressive Web App (PWA) |
| FPS | 60fps con delta time |
| Resolución | 360×640 lógica, escalada CSS |
| Offline | Service Worker cache |
| Touch | Drag to move, tap buttons |
| Keyboard | WASD + Space + Q + E |
| Ads | HTML divs sobre canvas en pantallas intermedias |
| Hosting | Web estática (GitHub Pages / Vercel / Netlify) |

---

## 💸 15. Monetización

- **Modelo:** 100% Gratis
- **Ingresos:** Ads en pantallas intermedias
  - Banner en menú principal
  - Interstitial en pantalla de victoria (entre niveles)
  - Interstitial en Game Over (antes de retry)
  - Rewarded ad opcional: "Ver ad para revivir con 50% vida"

---

## 🧪 16. MVP (Minimum Viable Product)

El MVP debe incluir:
- [ ] Jugador que se mueve y dispara
- [ ] Al menos 3 tipos de enemigos
- [ ] 1 nivel completo con waves + boss
- [ ] 1 power-up funcional
- [ ] HUD (vida, score)
- [ ] Menú principal
- [ ] Game Over / Victory

---

## 📈 17. Roadmap

| Fase | Duración | Contenido |
|------|----------|-----------|
| Día 1 | Motor + Jugador | Game loop, input, player, background |
| Día 2 | Combate | Enemigos, colisiones, partículas |
| Día 3 | Armas | Power-ups, 6 tipos de armas, HUD |
| Día 4 | Campaña | 7 niveles, wave system, bosses |
| Día 5 | UI/UX | Menú, tienda, fixture, ads |
| Día 6 | Polish | Arte final, audio, animaciones |
| Día 7 | Release | Testing, deploy, optimización |

---

## 🚀 18. Diferenciadores

1. **El único shooter mobile con temática paraguaya del Mundial**
2. **Comidas típicas como sistema de armas** (no existe en ningún otro juego)
3. **Fixture real del torneo** como progresión narrativa
4. **100% gratis y compartible por WhatsApp**
5. **Rejugabilidad** con final aleatorio entre 5 selecciones

---

## 🧩 19. Riesgos y Mitigación

| Riesgo | Mitigación |
|--------|-----------|
| Scope creep | MVP primero, polish después |
| Performance mobile | Object pooling, sprite sheets, delta time |
| Tiempo (1 semana) | Priorizar gameplay sobre arte |
| Distribución | Link directo + WhatsApp viral |
| Ads intrusivos | Solo en pantallas de transición, nunca durante gameplay |

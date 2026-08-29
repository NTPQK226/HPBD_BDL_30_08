# Birthday Website for Bùi Diệu Linh Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Create an ultra-smooth, romantic, and interactive birthday web experience for Bùi Diệu Linh (30/08/2005) with 3D envelope, candle-blowing interactive cake, romantic letter, 3D polaroid photo gallery, audio music player, and floating shooting stars.

**Architecture:** Single Page Application built with pure semantic HTML5, modern vanilla CSS3 with glassmorphism and keyframe animations, and vanilla JavaScript with Canvas 2D particle systems (confetti, stars, fireworks, shooting stars) and Web Audio fallback.

**Tech Stack:** HTML5, CSS3 (Custom properties, 3D transforms, backdrop filters, keyframes), JavaScript (ES6+, Canvas API, Web Audio API), Google Fonts (Playfair Display, Be Vietnam Pro, Dancing Script).

---

### Task 1: Project Setup, Design System & Canvas Particle Engine
- Setup project directory structure (`index.html`, `style.css`, `script.js`, `assets/`).
- Import refined typography with full Vietnamese diacritics support.
- Implement background ambient particle engine (twinkling starfield, floating glowing orbs, soft heart floaters).

### Task 2: Interactive 3D Envelope & Opening Scene
- Craft the 3D folded envelope with custom wax seal "BDL • 30/08".
- Add smooth unseal animation with floating letter emerge.
- Floating BGM music toggle player with animated equalizer bars.

### Task 3: Interactive Cake & Candle Blowing Experience
- Multi-tier glowing cake with realistic flame animation.
- Interactive click/blow trigger to extinguish candle with smoke effect.
- Instant confetti cannon & golden firework explosion upon extinguishing candle.

### Task 4: Love Letter, 3D Tilt Polaroid Gallery & Shooting Star Wishes
- Elegant love letter with handwritten script accent and paper texture.
- 3D tilt polaroid gallery cards with customizable captions and placeholders.
- Interactive "Gửi điều ước" form that launches a glowing shooting star across the screen.

### Task 5: Mobile Responsive Polish & Deployment Package
- Ensure 60fps smooth rendering on mobile devices (iOS Safari & Android Chrome).
- Add deployment guide for 5-second 1-click free Netlify Drop and Vercel.

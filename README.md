# Solar 3D Web App

Solar 3D is a stylized interactive observatory built with React, TypeScript, and Three.js.
It lets you explore a cinematic, real-time model of the Sun, planets, and Earth's Moon
through a control panel layered on top of a 3D scene.

## Highlights

- Real-time orbital animation for major solar system bodies
- Click any world in the scene to focus it
- HUD controls for playback, camera behavior, labels, and orbit paths
- Time-warp slider to speed up or slow down the simulation
- Cinematic camera mode with smooth easing transitions
- Stylized visuals with bloom, chromatic aberration, vignette, and noise
- Procedural asteroid belt, star layers, and sparkles
- Responsive interface that adapts to desktop and mobile layouts

## Tech Stack

- React 19 + TypeScript
- Vite 7
- three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing + postprocessing
- maath (easing utilities)

## Getting Started

### Prerequisites

- Node.js
- npm

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Available Scripts

- `npm run dev` - Starts the local dev server
- `npm run build` - Runs TypeScript checks and creates a production build
- `npm run preview` - Serves the production build locally
- `npm run lint` - Runs ESLint

## Controls

- Drag to orbit the camera
- Scroll to zoom in and out
- Click a body in the scene to select it
- Use the body pills to jump focus quickly
- Toggle Play/Pause, Follow, Cinematic, Orbits, and Labels
- Adjust simulation speed with the Time Warp slider

## Project Structure

```text
src/
  App.tsx                    # HUD layout, body selector, control panel
  components/SolarScene.tsx  # 3D scene, camera rig, effects, body rendering
  data/solarBodies.ts        # body definitions and orbital position math
```

## Customization

- Add or tune planets/moons in `src/data/solarBodies.ts`
- Change initial simulation settings in `src/App.tsx`
- Tweak rendering, camera, and effects in `src/components/SolarScene.tsx`
- Adjust UI styling in `src/App.css` and `src/index.css`

## Notes

- Planet textures are loaded from the official three.js example texture set.
- If a texture cannot be loaded, the app still renders bodies using fallback colors.

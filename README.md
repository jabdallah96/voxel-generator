# 🧊 Voxel Terrain Generator

Generate voxel-style 3D terrains from images using React, Three.js, and Vite.

🌐 **Live Demo**  
👉 [https://jabdallah96.github.io/voxel-generator/](https://jabdallah96.github.io/voxel-generator/)

---

## ✨ Features

- Upload an image and convert it into a 3D voxel heightmap
- Adjustable voxel **density**, **height scale**, and **mapping mode** (Luminance, Hue, Alpha)
- Export your terrain as a **GLTF (.gltf)** file - usable by modern game engines
- Utilizing **InstancedMesh** for fast rendering at high densities

---

## 🚀 Getting Started

```bash
git clone https://github.com/jabdallah96/voxel-generator.git
cd voxel-generator
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 📦 Build & Deploy

To create a production build:

```bash
npm run build
```

To deploy to GitHub Pages:

```bash
npm run deploy
```

Make sure your `vite.config.ts` includes:

```ts
base: '/voxel-generator/',
```

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/)
- [gh-pages](https://www.npmjs.com/package/gh-pages)

---

## 📄 License

MIT – feel free to fork, modify, and build on top of it.

---

## 🙌 Credits

Crafted by [@jabdallah96](https://github.com/jabdallah96)
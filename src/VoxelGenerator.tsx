import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export default function VoxelGenerator() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [sceneRef, setSceneRef] = useState<THREE.Scene | null>(null);
  const [, setCameraRef] = useState<THREE.PerspectiveCamera | null>(null);

  const [density, setDensity] = useState(32);
  const [heightScale, setHeightScale] = useState(2);
  const [heightMode, setHeightMode] = useState("luminance");

  useEffect(() => {
    if (!imageDataUrl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    setSceneRef(scene);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    setCameraRef(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    function generateVoxelsFromImage(img: HTMLImageElement) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = density;
      const height = density;

      canvas.width = width;
      canvas.height = height;

      context!.drawImage(img, 0, 0, width, height);
      const imgData = context!.getImageData(0, 0, width, height).data;

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial();
      const count = width * height;
      const instancedMesh = new THREE.InstancedMesh(geometry, material, count * 10);
      let index = 0;

      function getHeight(idx: number): number {
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        switch (heightMode) {
          case "hue": {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            return saturation * heightScale;
          }
          case "alpha":
            return (a / 255) * heightScale;
          case "luminance":
          default:
            return ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * heightScale;
        }
      }

      for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {
          const idx = (z * width + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const color = new THREE.Color(`rgb(${r},${g},${b})`);
          const voxelHeight = Math.floor(getHeight(idx));

          for (let y = 0; y < voxelHeight; y++) {
            const matrix = new THREE.Matrix4().makeTranslation(x - width / 2, y, z - height / 2);
            instancedMesh.setMatrixAt(index, matrix);
            instancedMesh.setColorAt(index, color);
            index++;
          }
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      scene.add(instancedMesh);
    }

    const img = new Image();
    img.src = imageDataUrl;
    img.onload = () => generateVoxelsFromImage(img);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [imageDataUrl, density, heightMode, heightScale]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (!sceneRef) return;
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], { type: "model/gltf+json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "voxel-scene.gltf";
        link.click();
      },
      (error) => {
        console.error("Error exporting GLTF:", error);
      },
      { binary: false }
    );
  };

  return (
    <div
      ref={mountRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ width: "100vw", height: "100vh", position: "relative", fontFamily: "sans-serif" }}
    >
      {!imageDataUrl && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <p><strong>Drag and drop an image</strong> (max 64×64 recommended)</p>
        </div>
      )}
      {imageDataUrl && (
        <button
          onClick={handleExport}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          Export GLTF
        </button>
      )}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "1rem",
          borderRadius: "10px",
          color: "white",
          zIndex: 10,
          fontSize: "0.9rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <label>
          Voxel Density: {density}
          <input
            type="range"
            min="4"
            max="64"
            value={density}
            onChange={(e) => setDensity(parseInt(e.target.value))}
          />
        </label>

        <label>
          Height Scale: {heightScale.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={heightScale}
            onChange={(e) => setHeightScale(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Height Mode:
          <select value={heightMode} onChange={(e) => setHeightMode(e.target.value)}>
            <option value="luminance">Luminance</option>
            <option value="hue">Hue/Saturation</option>
            <option value="alpha">Alpha Channel</option>
          </select>
        </label>
      </div>
    </div>
  );
}

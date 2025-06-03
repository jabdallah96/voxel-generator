import VoxelGenerator from "./VoxelGenerator";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#0f1117" }}>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "1.5rem",
          background: "linear-gradient(90deg, #1a1c24, #0f1117)",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: 600,
          textAlign: "center",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        }}
      >
        🧊 Voxel Terrain Generator
      </motion.div>

      <div style={{ paddingTop: "80px" }}>
        <VoxelGenerator />
      </div>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          padding: "1rem",
          color: "#bbb",
          fontSize: "0.85rem",
        }}
      >
        Drop an image above to generate a voxel terrain from its data. Built with ❤️ using React + Three.js.
      </motion.footer>
    </div>
  );
}

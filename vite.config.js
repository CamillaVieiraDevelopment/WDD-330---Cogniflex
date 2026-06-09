import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: "src", // Define the folder src as the development root
    build: {
        outDir: "../dist", // Folder where the final build will be generated
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                simulation: resolve(__dirname, "src/simulation.html"),
                dashboard: resolve(__dirname, "src/dashboard.html"),
            },
        },
    },
});
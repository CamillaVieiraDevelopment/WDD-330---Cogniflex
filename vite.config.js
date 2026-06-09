import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                simulation: resolve(__dirname, "src/simulation.html"),
                dashboard: resolve(__dirname, "src/dashboard.html"),
            },
        },
    },
});
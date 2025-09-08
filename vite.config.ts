import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import {defineConfig} from "vite"
import {nodePolyfills} from "vite-plugin-node-polyfills"

export default defineConfig({
    plugins: [react(), tailwindcss(), nodePolyfills()],
    worker: {format: "es", plugins: () => [nodePolyfills()]},
    resolve: {alias: {"@": path.resolve(__dirname, "./src")}},
    build: {target: "esnext", sourcemap: true, emptyOutDir: true},
    base: "/nixite/",
})

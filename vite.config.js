import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import path from "node:path";

const PORT = 3000;

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/global.css", "resources/js/main.tsx"],
            refresh: true,
        }),
        react(),
        checker({
            typescript: true,
            eslint: {
                lintCommand: 'eslint "./resources/js/**/*.{js,jsx,ts,tsx}"',
                dev: { logLevel: ["error"] },
            },
            overlay: {
                position: "tl",
                initialIsOpen: false,
            },
        }),
    ],
    resolve: {
        alias: [
            {
                find: /^~(.+)/,
                replacement: path.join(process.cwd(), "node_modules/$1"),
            },
            {
                find: /^src(.+)/,
                replacement: path.join(process.cwd(), "resources/js/$1"),
            },
        ],
    },
    server: {
      host: "127.0.0.1",  // Forces Vite to use IPv4
      port: 3000,
  },

    preview: { port: PORT, host: true },
    esbuild: {
      jsx: "automatic", // ✅ Ensures JSX support
    },
});

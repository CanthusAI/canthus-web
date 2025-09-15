import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { readFileSync } from "node:fs";

// Read version from workspace package.json
const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, "../package.json"), "utf-8"));

export default defineConfig({
	plugins: [
		// Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
		'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
	},
});

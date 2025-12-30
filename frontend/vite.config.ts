import react from "@vitejs/plugin-react";
import path from "path";
import { createLogger, defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

const baseline = process.env.BASE_DIR ? `/${process.env.BASE_DIR}/` : "/";

const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
	loggerError(`<VieError>${msg}</VieError>`, options);
};

export default defineConfig({
	base: baseline,
	server: {
        warmup: {
            clientFiles: [
                "./src/main.tsx",
                "./src/pages/NotFound.tsx",
                "./src/pages/Index.tsx",
                "./src/index.css",
            ]
        },
		host: "::",
		port: Number(process.env.FRONTEND_PORT || "5174"),
		allowedHosts: true,
		strictPort: true,
	},
	preview: {
		host: "::",
		port: Number(process.env.FRONTEND_PORT || "5174"),
		allowedHosts: true,
		strictPort: true,
		open: false,
	},
	customLogger: logger,
	plugins: [react(), tailwindcss()].filter(Boolean),
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		sourcemap: false,
		minify: false,
		outDir: "./output",
		emptyOutDir: true,
	},
	define: {
		__APP_BASE_PATH__: JSON.stringify(baseline),
	},
});

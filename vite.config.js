import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8000,
    },
    build: {
        outDir: 'build',
        rollupOptions: {
            output: {
                // Needed for sass imports.
                assetFileNames: `assets/images/[name].[ext]`,
            },
        },
    },
})

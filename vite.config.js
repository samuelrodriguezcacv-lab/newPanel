import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './resources/js/setupTests.js',
        include: ['resources/js/**/*.{test,spec}.{js,jsx,ts,tsx}'],
        exclude: ['vendor/**', 'node_modules/**'],
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});

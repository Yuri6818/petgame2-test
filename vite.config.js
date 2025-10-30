import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path for deployment
  base: './',
  
  // Configure server options
  server: {
    port: 3000,
    open: true, // Open browser on server start
  },

  // Configure build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Preserve your existing file structure and behavior
    rollupOptions: {
      input: {
        main: 'index.html',
        activities: 'activities.html',
        adopt: 'adopt.html',
        battle: 'battle.html',
        familiars: 'familiars.html',
        inventory: 'inventory.html',
        pound: 'pound.html',
        shop: 'shop.html',
      },
    },
    // Use the dedicated `public` folder for static assets (do NOT use project root)
    // This prevents Vite from copying repository metadata (like .git) into `dist`.
    // Keep copyPublicDir default behavior (true) so files placed in `public/` are copied.
  },

  // Serve and copy files from ./public (create this folder if you need static assets)
  publicDir: 'public',

  // Don't optimize or exclude core app JS by default. Leave as-is so your scripts run
  // in the browser the same way they did before.
  optimizeDeps: {
    exclude: []
  },
});
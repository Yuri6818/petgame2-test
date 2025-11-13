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
      }
    }
  }
});
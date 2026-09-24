import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        login: 'login.html',
        dashboard: 'dashboard.html',
        orders: 'orders.html',
        profile: 'profile.html',
        admin: 'admin.html',
        adminOrders: 'admin-orders.html',
        adminProducts: 'admin-products.html',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});

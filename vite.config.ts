
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/react-swc';
// Fix: Import process from node:process to ensure types are correctly recognized in Vite config
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This maps the .env variable to process.env so the code works as intended
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});

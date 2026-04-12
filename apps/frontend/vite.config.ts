import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import  {resolve, dirname } from "path"

// https://vite.dev/config/
const __dirname = dirname(__filename)
console.log("right here")
console.log(resolve(__dirname,"src"))
export default defineConfig({
  plugins: [
        react(),
        tailwindcss(),
    ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
})


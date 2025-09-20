import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const endWith = (name: string, str: string) => {
  const index = name.lastIndexOf(str)
  return name.length === index + str.length
}

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss()],
  base: '/web',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          if (
            chunkInfo.facadeModuleId &&
            chunkInfo.isDynamicEntry &&
            endWith(chunkInfo.facadeModuleId, '.json')
          ) {
            return 'i18n/[name].js'
          }
          return 'js/[name]-[hash].js'
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames(chunkInfo) {
          if (
            chunkInfo.names &&
            (endWith(chunkInfo.names[0], '.woff') || endWith(chunkInfo.names[0], '.woff2'))
          ) {
            return 'fonts/[name]-[hash].[ext]'
          }
          return '[ext]/[name]-[hash].[ext]'
        },
        manualChunks(id) {
          if (id.indexOf('node_modules') !== -1) {
            // pnpm
            return id.toString().split('node_modules/')[2].split('/')[0].toString()
            // yarn
            // return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})

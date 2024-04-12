import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['**/*.ts'],
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})

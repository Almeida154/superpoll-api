import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['**/*.ts'],
    },
    reporters: ['default', 'html'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})

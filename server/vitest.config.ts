import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: 6000000,
        hookTimeout: 600000,
        poolOptions: {
            threads: {
                singleThread: true
            }
        }
    },

})
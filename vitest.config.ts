import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/__tests__/**/*.test.ts'],
        env: dotenv.config({ path: '.env.test'}).parsed as any,
    },
});
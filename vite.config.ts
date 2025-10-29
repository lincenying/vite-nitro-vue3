import type { ConfigEnv } from 'vite'
// import events from 'node:events'
import path from 'node:path'
import process from 'node:process'

import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'

import Build from './vite.config.build'
import Components from './vite.config.components'
import Css from './vite.config.css'
import Macros from './vite.config.macros'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
    // events.EventEmitter.defaultMaxListeners = 0

    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    console.log(`当前编译环境: ${process.env.VITE_APP_ENV}`)

    return {
        base: './',
        assetsInclude: [
            '/static/**',
        ],
        server: {
            open: true,
            hmr: {
                port: 55373,
            },
            warmup: {
                clientFiles: ['./src/main.ts', './src/views/*.vue'],
            },
        },
        build: Build.build,
        css: Css,
        plugins: [
            ...Macros(),
            ...Components(),
            UnoCSS(),
            /**
             * 检查Vite插件的中间状态
             * @see https://github.com/antfu/vite-plugin-inspect#readme
             */
            Inspect(),
        ],
        resolve: {
            alias: {
                '~': path.join(__dirname, './src'),
                '@': path.join(__dirname, './src'),
                '~server': path.join(__dirname, './server'),
                '@server': path.join(__dirname, './server'),
            },
        },
    }
})

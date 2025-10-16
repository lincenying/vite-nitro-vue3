import type { BuildOptions } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: { build: BuildOptions } = {
    build: {
        target: 'es2018',
        cssTarget: 'chrome79',
        minify: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            external: /static\/.*?\.[cm]*js/,
            output: {
                manualChunks(id: string) {
                    // 处理css分块
                    // if (id.includes('.css') || id.includes('.scss') || id.includes('.sass') || id.includes('.less')) {
                    //     if (id.includes('node_modules'))
                    //         return 'vendor'
                    //     return 'main'
                    // }
                    if (id.includes('node_modules')) {
                        if (id.includes('element-plus')) {
                            return 'element-plus'
                        }
                        if (id.includes('lucide-vue-next') || id.includes('md-editor-v3')) {
                            return 'md-editor-v3'
                        }
                        if (id.includes('markdown-it') || id.includes('codemirror')) {
                            return 'markdown-it'
                        }
                        if (id.includes('vue-pdf')) {
                            return 'vue-pdf'
                        }
                        if (id.includes('pdfjs-dist')) {
                            return 'pdfjs-dist'
                        }
                        return 'vendor'
                    }
                    if (id.includes('__uno.css')) {
                        return 'unocss'
                    }
                },
            },
        },
    },
}

export default config

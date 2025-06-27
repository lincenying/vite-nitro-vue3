import type { ViteDevServer } from 'vite'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { defineLazyEventHandler, fromNodeMiddleware } from 'h3'
import { defineNitroConfig } from 'nitro/config'

import { createServer } from 'vite'

let viteServer: ViteDevServer | undefined
async function getViteServer() {
    if (!viteServer) {
        viteServer = await createServer({
            base: '/',
            appType: 'custom',
            server: {
                middlewareMode: true,
                hmr: {
                    port: 34678,
                },
            },
        })
    }
    return viteServer
}

const proxyDomain = process.env.NITRO_ENV_HOST_API_URL || 'https://php.mmxiaowu.com'

export default defineNitroConfig({
    srcDir: 'server',
    serveStatic: true,
    compatibilityDate: '2025-06-23',
    // 代理
    routeRules: {
        '/php/**': {
            proxy: {
                to: `${proxyDomain}/api/**`,
            },
            swr: false,
        },
    },
    // 将vite编译后的静态资源文件存入服务端
    publicAssets: [
        {
            baseURL: '/assets/',
            // 相对 `srcDir` 文件夹
            dir: '../dist/assets/',
        },
        {
            baseURL: '/static/',
            // 相对 `srcDir` 文件夹
            dir: '../dist/static/',
        },
    ],
    // 将vite编译后的html文件写入服务端资产
    serverAssets: [
        {
            baseName: 'appTemplate',
            // 相对 `srcDir` 文件夹
            dir: '../dist',
            ignore: ['static', 'assets'],
        },
    ],
    // 开启本地文件K/V存储
    storage: {
        fsdb: {
            driver: 'fs',
            // 相对项目根目录
            base: './.data/fsdb',
        },
    },
    // 开启sqlite数据库存储
    experimental: {
        database: true,
    },
    database: {
        // 配置SQLite数据库
        default: {
            connector: 'sqlite',
            options: {
                // 相对项目根目录
                path: './.data/db.sqlite',
                name: 'db',
            },
        },
        sqlite3: {
            connector: 'better-sqlite3',
            options: {
                // 相对项目根目录
                path: './.data/db.sqlite3',
                name: 'db',
            },
        },
    },
    // 开发环境处理程序
    devHandlers: [
        {
            route: '/',
            handler: defineLazyEventHandler(async () => {
                const server = await getViteServer()
                return fromNodeMiddleware(server.middlewares)
            }),
        },
        {
            route: '/:wsPath(vite|socket.io|ws)?',
            handler: defineLazyEventHandler(async () => {
                const server = await getViteServer()
                return (event) => {
                    try {
                        if (event.node.req.headers.upgrade === 'websocket') {
                            server.httpServer?.emit(
                                'upgrade',
                                event.node.req,
                                event.node.req.socket,
                                Buffer.alloc(0),
                            )
                        }
                    }
                    catch (_err) {
                        event.node.res.statusCode = 500
                        event.node.res.end('WebSocket upgrade error')
                    }
                }
            }),
        },
    ],
})

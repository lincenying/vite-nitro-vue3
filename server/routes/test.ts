import path from 'node:path'
import process from 'node:process'
import { defineEventHandler } from 'h3'
import Twig from 'twig'

export default defineEventHandler(async () => {
    const data = {
        seo: {
            title: '首页',
        },
        user: '林岑影',
    }
    const templateDir = path.join(process.cwd(), 'server/template/index.twig')
    const html = await new Promise((resove) => {
        Twig.renderFile(templateDir, data, (err, html) => {
            resove(err ? err.toString() : html)
        })
    })

    return html
})

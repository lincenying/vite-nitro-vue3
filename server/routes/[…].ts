import process from 'node:process'
import { defineEventHandler } from 'h3'

const isProd = process.env.NODE_ENV === 'production'

export default defineEventHandler(async () => {
    let template: string
    if (isProd) {
        // In production, we use the bundled storage to get the template
        template = (await useStorage('assets:appTemplate').getItem(`index.html`)) as string
    }
    else {
        // In development, we fetch the template from the root directory
        template = (await useStorage().getItem('root:index.html')) as string
    }
    return template
})

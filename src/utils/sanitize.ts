import DOMPurify from 'dompurify'

/**
 * 对 HTML 内容进行 XSS 消毒
 */
export function sanitizeHtml(html: string): string {
    if (!html) {
        return ''
    }
    if (typeof window === 'undefined') {
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    }
    return DOMPurify.sanitize(html)
}

import type { Article, InsertSucces } from '../../../types'
import { UTC2Date } from '@lincy/utils'
import { defineEventHandler, readBody } from 'h3'
import { useDatabase } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
    const db = useDatabase('sqlite3')

    const body = await readBody<Article>(event)

    const { id, title, content, category } = body

    const date = UTC2Date('', 'yyyy-mm-dd hh:ii:ss')

    if (!title || !content || !category) {
        return {
            code: 400,
            message: 'Invalid request',
        }
    }

    // id title content author category views date
    const result = await db.prepare('UPDATE article SET title = ?, content = ?, category = ?, date = ? where id = ?').run(title, content, category, date, id) as InsertSucces

    return {
        code: 200,
        message: 'API is working!',
        data: result,
    }
})

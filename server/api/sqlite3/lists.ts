import { useDatabase } from 'nitro/runtime'

export interface InsertSucces {
    success: boolean
    lastInsertRowid: number
    changes: number
}

export interface User {
    id: string
    userid: string
    firstName: string
    lastName: string
    email: string
}

export interface QueryResult {
    rows: User[]
    success: boolean
}

export default defineEventHandler(async () => {
    const db = useDatabase('sqlite3')

    // Query for users
    // const { rows } = await db.sql<QueryResult>`SELECT * FROM users`
    const data = await db.prepare('SELECT * FROM users').all() as User[]

    return {
        code: 200,
        message: 'API is working!',
        data,
    }
})

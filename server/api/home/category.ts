import { defineEventHandler, setCookie } from 'h3'
import Mock from 'mockjs'

export default defineEventHandler(async (event) => {
    setCookie(event, 'category', `${+new Date()}`, { maxAge: 60 * 60 * 24 * 7 })
    return {
        code: 200,
        message: 'ok',
        data: Mock.mock(Array.from({ length: 6 }, (_, index) => ({
            id: index + 1,
            title: '@cword(3, 5)',
        }))),
    }
})

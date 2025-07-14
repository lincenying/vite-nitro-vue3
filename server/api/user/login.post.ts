import type { UserListType } from '../../types'
import { defineEventHandler, readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const users: UserListType[] = [{
        name: 'admin',
        nickName: 'admin',
        role: '系统管理员',
        password: '123456',
        isAdmin: '1',
        token: 'admin',
        info: {
            name: '系统管理员',
        },
    }, {
        name: 'editor',
        nickName: 'admin',
        role: '系统管理员',
        password: '123456',
        isAdmin: '1',
        token: 'editor',
        info: {
            name: '编辑人员',
        },
    }, {
        name: 'test',
        nickName: 'admin',
        role: '系统管理员',
        password: '123456',
        isAdmin: '1',
        token: 'test',
        info: {
            name: '测试人员',
        },
    }]

    const body = await readBody(event)

    const user = users.find((user) => {
        return body.name === user.name && body.password === user.password
    })
    if (user) {
        setCookie(event, 'token', user.token, { maxAge: 60 * 60 * 24 * 7 })
        return {
            code: 200,
            data: user,
            message: 'success',
        }
    }
    return {
        code: 401,
        data: null,
        message: '用户名或密码错误',
    }
})

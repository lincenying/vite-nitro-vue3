import type { ListPageType } from '~/types'
import Mock from 'mockjs'

export default defineEventHandler(async (event) => {
    const { page, pageSize } = getQuery<ListPageType>(event)
    const template = {
        list: Array.from({ length: pageSize }, (_, index) => ({
            id: (page - 1) * pageSize + index + 1,
            imgUrl: getRandomValue(imgUrl),
            title: '@ctitle(7, 20)',
            date: '@date("yyyy-MM-dd")',
            intro: '@cparagraph(10, 15)',
        })),
        hasNext: 1,
        total: 100,
        pageSize: Number(pageSize),
        currPage: Number(page),
    }
    const data = Mock.mock(template)
    return {
        code: 200,
        message: 'ok',
        data,
    }
})

export type Methods = 'get' | 'post' | 'delete' | 'put'

export interface ServiceType {
    url: string
    method: Methods
    data: Objable
    /** 是否验证code, 默认:true */
    checkCode?: boolean
    /** 超时时间 */
    timeout?: number
    [key: string]: any
}

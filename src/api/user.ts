/**
 * 用户登录
 */
export function loginUser(api: ApiType, params: { name: string, password: string }) {
    return api.post<{
        name: string
        nickName: string
        role: string
        isAdmin: number
        info: { name: string }
    }>('/user/login', params)
}

/**
 * 用户登出
 */
export function logoutUser(api: ApiType = $api) {
    return api.post('/user/logout')
}

/**
 * 获取当前用户信息
 */
export function fetchUserProfile(api: ApiType = $api) {
    return api.get<{
        id: number
        name: string
        nickName: string
        role: string
        isAdmin: number
        info: { name: string }
    }>('/user/profile')
}

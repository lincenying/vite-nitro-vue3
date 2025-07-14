export interface CommentUser {
    name: string
    avatar: string
}

export interface CommentChildren {
    id: number
    article: number
    user: CommentUser
    date: string
    content: string
}

export interface CommentList {
    id: number
    article: number
    user: CommentUser
    date: string
    content: string
    children: CommentChildren[]
}

import type globalDialog from '~/components/global/dialog.vue'

export type CommentCategoryType = 'article' | 'product' | 'cases' | 'faqs' | 'news'

export type GlobalDiaslogInstance = InstanceType<typeof globalDialog>

export interface GlobalDialogLayer<T = Objable> {
    show: boolean
    title: string
    showButton?: boolean
    row?: T
    width?: string
    [propName: string]: any
}

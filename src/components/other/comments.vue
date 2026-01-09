<template>
    <div ref="commnetBox" class="global-box" w-full mb-24px p-24px bg="hex-fff" b-rd-6px>
        <div class="global-box-title" m="0 b-24px" pl-16px text="1rem hex-202935" font-bold b-l="6px bolid hex-007bff">评论列表</div>
        <div class="global-box-content">
            <ul>
                <li v-for="(item, index) in commentList?.list" :key="index">
                    <div flex="~" p="y-20px" b-b="1px solid hex-f7f7f7">
                        <img w-40px h-40px b="rd-50%" :src="item.user.avatar" alt="">
                        <div ml-16px>
                            <div text="hex-6a6a6a 13px" font-bold>
                                <a href="#">{{ item.user.name }}</a>
                            </div>
                            <div mt-6px text="hex-717171">{{ item.date }}</div>
                            <div text="hex-333 14px" lh-24px mt-12px>{{ item.content }}</div>
                        </div>
                    </div>
                    <ul v-if="item.children && item.children.length > 0" ml-56px>
                        <li v-for="(sub_item, sub_index) in item.children" :key="sub_index">
                            <div flex="~" p="y-20px" b-b="1px solid hex-f7f7f7">
                                <img w-40px h-40px b="rd-50%" :src="sub_item.user.avatar" alt="">
                                <div ml-16px>
                                    <div text="hex-6a6a6a 13px" font-bold>
                                        <a href="#">{{ sub_item.user.name }}</a>
                                    </div>
                                    <div mt-6px text="hex-717171">{{ sub_item.date }}</div>
                                    <div text="hex-333 14px" lh-24px mt-12px>{{ sub_item.content }}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
            <div v-if="commentList.total > 10" class="page" flex="~ justify-center" mt-24px>
                <el-pagination background layout="prev, pager, next" :total="commentList.total" :page-size="10" @current-change="currentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CommentList } from '~/types/comments.types'
import type { CommentCategoryType } from '~/types/components.types'
import type { ListType } from '~/types/global.types'
import type { InitType } from '~/types/home.types'
import { defaultList } from '~/constants'
import { scrollToComment } from '~/utils'

defineOptions({
    name: 'CommentLists',
})
const props = defineProps<{
    type: CommentCategoryType
    id: string | number
}>()

const { id, type } = $(toRefs(props))

const commentStore = useCommentStore()
const { detail } = storeToRefs(commentStore)

let page = $ref<number>(1)

const commentList = computed<ListType<CommentList>>(() => detail.value[`${type}-${id}`] || defaultList())

const commnetBox = ref<HTMLElement>()
async function initFn(action: InitType = 'init-data') {
    if (action === 'change-data' || action === 'change-page') {
        scrollToComment(commnetBox, -104)
    }
}

async function currentChange(newPage: number) {
    page = newPage
    commentStore.getComment({ type, id, page }, $api)
    initFn('change-page')
}

function emitterFn(type: CommentCategoryType) {
    page = 1
    commentStore.getComment({ type, id, page }, $api)
    initFn('change-data')
}

let unsubscribe: () => void

onMounted(() => {
    // emitter.on(`refresh-${props.type}-comment`, emitterFn)
    unsubscribe = commentEvent[props.type].on(emitterFn)
})

onUnmounted(() => {
    // emitter.off(`refresh-${props.type}-comment`, emitterFn)
    unsubscribe()
})
</script>

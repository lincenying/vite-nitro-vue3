<template>
    <div bg="hex-fff" mb-24px p-32px>
        <div flex="~ items-center col">
            <el-skeleton-item variant="text" class="!w-1/2 !h-44px" />
            <el-skeleton-item variant="text" class="!w-50% !h-21px mt-16px" />
        </div>
        <div v-for="index in 6" :key="index" mt-21px>
            <el-skeleton-item variant="text" class="!h-21px ml-32px !w-80%" />
            <el-skeleton-item
                v-for="item in 4"
                :key="`${index}-${item}`"
                variant="text"
                class="!h-21px mt-6px"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'ContentDetailSkeleton',
})
</script>

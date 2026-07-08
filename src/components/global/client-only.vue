<template>
    <template v-if="mounted">
        <slot />
    </template>
    <template v-else>
        <slot name="fallback">
            <slot name="placeholder">
                <span v-if="props.fallback || props.placeholder">{{ props.fallback || props.placeholder }}</span>
            </slot>
        </slot>
    </template>
</template>

<script setup lang="ts">
defineOptions({
    name: 'ClientOnly',
})

const props = defineProps<{
    fallback?: string
    placeholder?: string
}>()

const mounted = ref(false)
onMounted(() => {
    mounted.value = true
})
</script>

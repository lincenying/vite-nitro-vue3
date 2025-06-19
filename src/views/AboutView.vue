<template>
    <div class="about">
        <h1>这是一个关于页面,  <br>请求了一个由Nitro提供的接口</h1>
        <p>{{ data }}</p>
    </div>
</template>

<script setup lang="ts">
import { ofetch } from 'ofetch'

defineOptions({
    name: 'AboutView',
})

const data = await ofetch('/api/info')

console.log(data)
</script>

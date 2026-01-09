<template>
    <div class="global-header" flex="~ none justify-center items-center" fixed z-999 left-0 top-0 w-100vw h="80px!" bg-hex-fff>
        <div flex="~ auto" max-w-1294px>
            <img :src="NavLogo" w-109px h-31px alt="">
            <div class="menu-wrap" flex="~ items-center" ml-64px>
                <router-link class="menu-item" :class="menuActive === 'home' ? 'active' : ''" mr-32px text-16px lh-32px to="/">产品展示</router-link>
                <router-link class="menu-item" :class="menuActive === 'cases' ? 'active' : ''" mr-32px text-16px lh-32px to="/cases">案例展示</router-link>
                <router-link class="menu-item" :class="menuActive === 'news' ? 'active' : ''" mr-32px text-16px lh-32px to="/news">新闻中心</router-link>
                <router-link class="menu-item" :class="menuActive === 'faqs' ? 'active' : ''" mr-32px text-16px lh-32px to="/faqs">常见问题</router-link>
                <router-link class="menu-item" :class="menuActive === 'article' ? 'active' : ''" mr-32px text-16px lh-32px to="/article">SQLite文章</router-link>
                <router-link class="menu-item" :class="menuActive === 'pdf' ? 'active' : ''" mr-32px text-16px lh-32px to="/pdf">PDF</router-link>
                <router-link class="menu-item" :class="menuActive === 'editor' ? 'active' : ''" mr-32px text-16px lh-32px to="/editor">编辑器</router-link>
            </div>
        </div>
    </div>
    <div h-80px></div>
</template>

<script setup lang="ts">
import NavLogo from '@/assets/images/nav-logo.png'

defineOptions({
    name: 'GlobalHeader',
})

const globalStore = useGlobalStore()
const { menuActive } = storeToRefs(globalStore)
</script>

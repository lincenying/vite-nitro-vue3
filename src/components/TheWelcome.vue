<template>
    <WelcomeItem>
        <template #icon>
            <DocumentationIcon />
        </template>
        <template #heading>文档</template>

        Vue的
        <a href="https://vuejs.org/" target="_blank" rel="noopener">官方文档</a>
        为您提供了入门所需的所有信息。
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <ToolingIcon />
        </template>
        <template #heading>工具</template>

        本项目由
        <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener">Vite</a> 提供开发环境和编译。推荐使用
        <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a>
        +
        <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener">Vue - Official</a>编辑器,
        更多说明请参阅
        <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>。
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <EcosystemIcon />
        </template>
        <template #heading>生态</template>

        获取适用于您项目的官方工具和库:
        <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>,
        <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>,
        <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a>, 和
        <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>。 If
        如果您需要更多资源，建议您访问
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue</a>。
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <CommunityIcon />
        </template>
        <template #heading>社区</template>

        遇到问题了？请在 <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>（我们的官方 Discord 服务器）或 <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener">StackOverflow</a> 上提问。
        您也可以关注官方 <a href="https://bsky.app/profile/vuejs.org" target="_blank" rel="noopener">@vuejs.org</a> Bluesky 账号或 <a href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</a> X 账号，获取 Vue 的最新消息。
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <SupportIcon />
        </template>
        <template #heading>支持</template>
        作为一个独立项目，Vue 的可持续发展依赖于社区的支持。您可以成为<a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">赞助商</a>来帮助我们。
    </WelcomeItem>
</template>

<script setup lang="ts">
import CommunityIcon from './icons/IconCommunity.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import SupportIcon from './icons/IconSupport.vue'
import ToolingIcon from './icons/IconTooling.vue'
import WelcomeItem from './WelcomeItem.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

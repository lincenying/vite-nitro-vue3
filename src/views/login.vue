<template>
    <section class="login-page">
        <div class="login-box">
            <div class="title">用户登录</div>
            <div class="login-form">
                <el-input v-model="form.name" size="small" placeholder="请输入用户名" @keyup.enter="handleLogin">
                    <template #prepend>用户名</template>
                </el-input>
                <el-input v-model="form.password" size="small" type="password" placeholder="请输入密码" @keyup.enter="handleLogin">
                    <template #prepend>密&nbsp;码</template>
                </el-input>
                <div class="login-line" />
                <el-button :disabled="loading" :loading="loading" size="small" class="login-btn" @click="handleLogin">登 录</el-button>
            </div>
            <div class="login-tip">推荐使用最新版本谷歌浏览器, 确保页面内容显示正常<br>页面分辨率为1920 x 1080</div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { loginUser } from '~/api/user'
import { appName } from '~/constants'

defineOptions({
    name: 'Login',
})

useHead({
    title: `登录 - ${appName}`,
})

const { ctx } = useGlobal()
const userStore = useUserStore()
const router = useRouter()

const [loading, toggleLoading] = useToggle(false)

const form = reactive({
    name: '',
    password: '',
})

/**
 * 提交登录请求
 */
async function handleLogin() {
    if (!form.name || !form.password) {
        ctx.$message.error('请输入用户名密码!')
        return
    }
    toggleLoading(true)
    const { code, data, message } = await loginUser($api, {
        name: form.name.trim(),
        password: form.password,
    })
    toggleLoading(false)

    if (code !== 200 || !data) {
        ctx.$message.error(message || '用户名或密码错误!')
        return
    }

    userStore.setInfo(data)
    ctx.$message.success('登录成功!')
    router.push('/')
}
</script>

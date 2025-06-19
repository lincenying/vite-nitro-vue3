<template>
    <header class="app-header">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125">

        <div class="wrapper">
            <HelloWorld msg="你做到了!" />

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <Suspense>
        <RouterView />
    </Suspense>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

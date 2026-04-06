<!-- 小图 + 标题模板，标题可点击跳转；openMode 控制当前页或新页打开 -->
<template>
    <div class="img_title">
        <img :src="props.src" :title="props.title" class="img">
        <div class="title" :class="{ clickable: !!props.link }" @click="handleNavigate(props.link, props.openMode)">
            {{ props.title }}
        </div>
    </div>
</template>
<script setup lang="ts">
    const props = defineProps<{
        src: string
        title: string
        link?: string
        openMode?: 'self' | 'blank'
    }>()

    const handleNavigate = (link?: string, openMode?: 'self' | 'blank') => {
        if (!link) {
            return
        }

        if (openMode === 'blank') {
            window.open(link, '_blank', 'noopener,noreferrer')
            return
        }

        window.location.href = link
    }
</script>
<style scoped>
    .img_title {
        display: flex;
        align-items: center;
    }

    .img {
        width: 30px;
        height: 30px;
        margin-right: 20px;
    }

    .title {
        font-size: 14px;
        color: #333;
        width: fit-content;
    }

    .title:hover {
        color: blueviolet;
        cursor: pointer;
    }
</style>
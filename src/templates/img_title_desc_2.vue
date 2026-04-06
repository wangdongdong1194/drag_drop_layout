<!-- 左侧矩形图片，鼠标悬停切换图片，点击标题跳转链接 -->
<template>
    <div class="img_title_desc">
        <img :src="currentSrc" :title="props.title" class="img" @mouseenter="showHoverImage"
            @mouseleave="showDefaultImage">
        <div class="title_desc">
            <div class="title" :class="{ clickable: !!props.link }" @click="handleNavigate">
                {{ props.title }}
            </div>
            <div class="desc">{{ props.desc }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'

    const props = defineProps<{
        src: string
        title: string
        src2?: string
        desc?: string
        link?: string
        openMode?: 'self' | 'blank'
    }>()

    const currentSrc = ref(props.src)

    const showHoverImage = () => {
        if (!props.src2) {
            return
        }

        currentSrc.value = props.src2
    }

    const showDefaultImage = () => {
        currentSrc.value = props.src
    }

    const handleNavigate = () => {
        if (!props.link) {
            return
        }

        if (props.openMode === 'blank') {
            window.open(props.link, '_blank', 'noopener,noreferrer')
            return
        }

        window.location.href = props.link
    }
</script>
<style scoped>
    .img_title_desc {
        display: flex;
        min-width: 150px;
        width: 375px;
    }

    .img {
        width: 95px;
        height: 95px;
        margin-right: 20px;
    }

    .title_desc {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        min-width: 0;
    }

    .title,
    .desc {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .title:hover {
        color: blueviolet;
        cursor: pointer;
    }

    .desc {
        color: #999;
        font-size: 14px;
        cursor: default;
    }
</style>
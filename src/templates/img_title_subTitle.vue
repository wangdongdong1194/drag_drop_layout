<!-- 大图 + 主标题 + 副标题模板，主副标题可分别配置跳转链接 -->
<template>
    <div class="img_title_desc">
        <div class="img_wrap" :class="{ clickable: !!props.link }" @click="handleNavigate(props.link, props.openMode)">
            <img :src="props.src" :title="props.title" class="img">
        </div>
        <div class="titles">
            <div class="title" :class="{ clickable: !!props.link }" @click="handleNavigate(props.link, props.openMode)">
                {{ props.title }}
            </div>
            <div class="subTitle" :class="{ clickable: !!props.subTitleLink }"
                @click="handleNavigate(props.subTitleLink, props.openMode)">
                {{ props.subTitle }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    const props = defineProps<{
        src: string
        title: string
        link?: string
        subTitle?: string
        subTitleLink?: string
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
    .img_title_desc {
        background: #fff;
        /* border-radius: 20px; */
        /* overflow: hidden; */
    }

    .img_wrap {
        overflow: hidden;
    }

    .img {
        display: block;
        width: 100%;
        height: auto;
        transition: transform 0.85s ease;
        transform-origin: center center;
    }

    .img_wrap:hover .img {
        transform: scale(1.08);
    }

    .titles {
        margin: 30px 20px;
    }

    .title {
        font-weight: 400;
        margin-bottom: 15px;
        width: fit-content;
        height: 45px;
    }

    .title:hover {
        color: blueviolet;
    }

    .clickable {
        cursor: pointer;
    }

    .subTitle {
        color: #999;
        font-size: 14px;
        width: fit-content;
    }

    .subTitle:hover {
        color: blueviolet;
    }
</style>
<!-- 大图 + 标题描述模板，图片和标题都支持点击跳转 -->
<template>
    <div class="img_title_desc">
        <div class="img_wrap" :class="{ clickable: !!props.link }" @click="handleNavigate">
            <img :src="props.src" :title="props.title" class="img">
        </div>
        <div class="title_desc">
            <div class="title" :class="{ clickable: !!props.link }" @click="handleNavigate">
                {{ props.title }}
            </div>
            <div class="desc">{{ props.desc }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    const props = defineProps<{
        src: string
        title: string
        desc?: string
        link?: string
        openMode?: 'self' | 'blank'
    }>()

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

    .title_desc {
        margin: 30px 20px;
    }

    .title {
        font-weight: 400;
        margin-bottom: 15px;
        width: fit-content;
    }

    .title:hover {
        color: blueviolet;
    }

    .clickable {
        cursor: pointer;
    }

    .desc {
        color: #999;
        font-size: 14px;
    }
</style>
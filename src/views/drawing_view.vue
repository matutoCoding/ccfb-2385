<script setup lang="ts">
import { Images } from 'lucide-vue-next'

import EmptyState from '@/components/common/empty_state.vue'
import PageHeader from '@/components/common/page_header.vue'
</script>

<template>
  <section class="page">
    <PageHeader title="出图" subtitle="批量截图、SVG/DXF 轮廓导出与封口面积核对（M7 落地）" />
    <EmptyState
      :icon="Images"
      title="暂无出图任务"
      subtitle="按相机视角与切面预设批量出图，轮廓支持 SVG 与 DXF"
    />
  </section>
</template>

<style scoped>
.page {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}
</style>

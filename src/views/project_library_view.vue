<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next'

import EmptyState from '@/components/common/empty_state.vue'
import PageHeader from '@/components/common/page_header.vue'
</script>

<template>
  <section class="page">
    <PageHeader title="工程库" subtitle="工程复制、归档往返与自动保存（M1/M6 落地）" />
    <EmptyState
      :icon="FolderOpen"
      title="还没有工程"
      subtitle="创建工程后可导入 glTF，自动保存到本地浏览器库"
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

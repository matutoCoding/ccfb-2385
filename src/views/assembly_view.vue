<script setup lang="ts">
import { Boxes } from 'lucide-vue-next'

import EmptyState from '@/components/common/empty_state.vue'
import PageHeader from '@/components/common/page_header.vue'
</script>

<template>
  <section class="page">
    <PageHeader title="装配" subtitle="glTF 导入、坏网格定位、层级显隐与局部变换（M2/M3 落地）" />
    <EmptyState
      :icon="Boxes"
      title="未加载装配"
      subtitle="支持 .glb / .gltf，导入时选择源单位并换算为毫米"
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

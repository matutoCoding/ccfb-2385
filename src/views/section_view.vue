<script setup lang="ts">
import { Scissors } from 'lucide-vue-next'

import EmptyState from '@/components/common/empty_state.vue'
import PageHeader from '@/components/common/page_header.vue'
</script>

<template>
  <section class="page">
    <PageHeader title="剖切" subtitle="世界轴切面、双平面切片、封口留孔与剖面着色（M4/M5 落地）" />
    <EmptyState
      :icon="Scissors"
      title="暂无可剖切模型"
      subtitle="先在装配页导入模型；封口保留内孔，剖面面积实时核对"
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

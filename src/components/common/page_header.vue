<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <header class="page-header">
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.page-title {
  margin: 0;
  font-size: var(--fs-2xl);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.page-subtitle {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
</style>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <component :is="icon" :size="28" :stroke-width="1.5" />
    </div>
    <p class="empty-state-title">{{ title }}</p>
    <p class="empty-state-subtitle">{{ subtitle }}</p>
    <div v-if="$slots.default" class="empty-state-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-7) var(--sp-5);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.empty-state-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--sp-2);
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  color: var(--text-muted);
}

.empty-state-title {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.empty-state-subtitle {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.empty-state-action {
  margin-top: var(--sp-4);
}
</style>

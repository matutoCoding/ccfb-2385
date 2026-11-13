<script setup lang="ts">
import { Boxes, FolderOpen, Images, Scissors } from 'lucide-vue-next'
import { RouterLink, RouterView } from 'vue-router'

const nav_items = [
  { to: '/library', label: '工程库', icon: FolderOpen },
  { to: '/assembly', label: '装配', icon: Boxes },
  { to: '/section', label: '剖切', icon: Scissors },
  { to: '/drawing', label: '出图', icon: Images },
]
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="app-brand">
        <span class="app-brand-title">内腔审片剖切台</span>
      </div>
      <nav class="app-nav">
        <RouterLink
          v-for="item in nav_items"
          :key="item.to"
          :to="item.to"
          class="app-nav-item"
          active-class="is-active"
        >
          <component :is="item.icon" :size="18" :stroke-width="1.7" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100%;
}

.app-sidebar {
  width: 224px;
  flex-shrink: 0;
  padding: var(--sp-5) var(--sp-4);
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.app-brand {
  padding: 0 var(--sp-2) var(--sp-5);
}

.app-brand-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.app-nav {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.app-nav-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: var(--fs-sm);
  text-decoration: none;
  transition:
    background var(--t-fast),
    color var(--t-fast);
}

.app-nav-item:hover {
  background: var(--surface-sunken);
  color: var(--text-base);
}

.app-nav-item.is-active {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-weight: var(--fw-medium);
}

.app-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}
</style>

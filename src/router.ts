import { createRouter, createWebHashHistory } from 'vue-router'

import AssemblyView from '@/views/assembly_view.vue'
import DrawingView from '@/views/drawing_view.vue'
import ProjectLibraryView from '@/views/project_library_view.vue'
import SectionView from '@/views/section_view.vue'

// 四个主路由：工程库 / 装配 / 剖切 / 出图；hash 路由保证纯静态部署可刷新
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/library' },
    { path: '/library', name: 'library', component: ProjectLibraryView, meta: { title: '工程库' } },
    { path: '/assembly', name: 'assembly', component: AssemblyView, meta: { title: '装配' } },
    { path: '/section', name: 'section', component: SectionView, meta: { title: '剖切' } },
    { path: '/drawing', name: 'drawing', component: DrawingView, meta: { title: '出图' } },
  ],
})

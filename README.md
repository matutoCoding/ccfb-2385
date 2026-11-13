# 内腔审片剖切台 section-bench

纯浏览器三维剖切工具：剖切封口但保留孔洞，支持剖面面积核对与 SVG/DXF 轮廓导出。

## 技术栈

Vue 3.5 + TypeScript（strict）+ Vite 8 + Tailwind CSS 4 + Pinia + Vue Router，Three.js 0.187，earcut / idb / jszip，全部为公开 npm 包，纯前端无服务端。

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发服务器
pnpm test           # vitest 单次运行
pnpm test:watch     # 测试监听
pnpm build          # 类型检查 + 生产构建
pnpm lint           # ESLint（含 engine/stores 分层隔离规则）
```

## 目录约定

- `src/engine` 框架无关的 three/算法层，禁止导入 vue、pinia
- `src/stores` Pinia 纯数据状态，禁止导入 three
- `src/libs` 第三方库统一出口，项目内从 `@/libs` 导入
- 文件名全小写下划线；注释用单行注释

## 验收夹具

`src/engine/fixture/hollow_prism.ts` 生成外方 10mm、内孔 6mm、长 20mm 的毫米制空心棱柱，理论横截面积 64mm²，z 向含 0/10/20 顶点环，用于验证切面过顶点稳定性。

## 里程碑

- [x] M0 脚手架：路由、设计 token、分层 lint
- [x] M1 算法内核：轮廓求交/成环/earcut、面积、SVG/DXF、夹具单测
- [ ] M2 引擎骨架与 glTF 导入
- [ ] M3 网格体检
- [ ] M4 剖切视觉轨（stencil 封口）
- [ ] M5 计量接入、测量、书签、撤销重做、预设
- [ ] M6 状态持久化、自动保存、zip 往返
- [ ] M7 批量出图、面积核对表、收尾

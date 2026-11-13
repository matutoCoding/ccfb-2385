import { describe, expect, it } from 'vitest'

import { hollow_prism } from '@/engine/fixture/hollow_prism'

describe('空心棱柱夹具', () => {
  it('索引不越界且全部三角形有效', () => {
    const geometry = hollow_prism()
    const vertex_count = geometry.positions.length / 3
    const index = geometry.index as Uint32Array
    expect(index.length % 3).toBe(0)
    for (const id of index) {
      expect(id).toBeGreaterThanOrEqual(0)
      expect(id).toBeLessThan(vertex_count)
    }
  })

  it('不含 NaN 顶点', () => {
    const geometry = hollow_prism()
    for (const value of geometry.positions) expect(Number.isFinite(value)).toBe(true)
  })

  it('尺寸落在 10×10×20 包围盒，孔边为 6', () => {
    const geometry = hollow_prism()
    const xs: number[] = []
    const ys: number[] = []
    const zs: number[] = []
    for (let i = 0; i < geometry.positions.length; i += 3) {
      xs.push(geometry.positions[i])
      ys.push(geometry.positions[i + 1])
      zs.push(geometry.positions[i + 2])
    }
    expect(Math.min(...xs)).toBe(-5)
    expect(Math.max(...xs)).toBe(5)
    expect(Math.min(...ys)).toBe(-5)
    expect(Math.max(...ys)).toBe(5)
    expect(Math.min(...zs)).toBe(0)
    expect(Math.max(...zs)).toBe(20)
    // 内孔角点坐标 ±3
    expect(xs).toContain(3)
    expect(xs).toContain(-3)
  })
})

import { describe, expect, it } from 'vitest'

import type { RawGeometry } from '@/types/contour'
import { extract_contour } from '@/engine/contour/contour_engine'

// 四面体：底面三点在 z=0，顶点在 z=2；z=0 切面恰好穿过三个底顶点
function tetrahedron(): RawGeometry {
  const positions = Float32Array.from([
    -1, -1, 0,
    1, -1, 0,
    0, 1, 0,
    0, 0, 2,
  ])
  return {
    nodeId: 'tetra',
    positions,
    index: Uint32Array.from([0, 1, 2, 0, 3, 1, 1, 3, 2, 2, 3, 0]),
  }
}

describe('切面穿过网格顶点', () => {
  it('平面过底顶点时不产生退化点，轮廓为可计算的闭合环', () => {
    const contour = extract_contour([tetrahedron()], {
      planeId: 'vertex-plane',
      axis: 'z',
      distance: 0,
      eps: 1e-7,
    })
    expect(contour.loops.length).toBeGreaterThan(0)
    for (const loop of contour.loops) {
      expect(loop.pointIds.length).toBeGreaterThanOrEqual(3)
      // 同一环内无重复点，说明顶点命中路径没有生成零长度线段
      expect(new Set(loop.pointIds).size).toBe(loop.pointIds.length)
      for (const point of loop.worldPoints) expect(point.z).toBeCloseTo(0, 9)
    }
  })

  it('过顶点平面与微小偏移平面给出相同面积量级，无突变', () => {
    const at_vertex = extract_contour([tetrahedron()], {
      planeId: 'a',
      axis: 'z',
      distance: 0,
      eps: 1e-7,
    })
    const offset = extract_contour([tetrahedron()], {
      planeId: 'b',
      axis: 'z',
      distance: 1e-6,
      eps: 1e-7,
    })
    // 底面在 z=0 处截面即底三角形；微小偏移截面应接近该面积
    expect(Math.abs(at_vertex.capArea - offset.capArea)).toBeLessThan(1e-3)
  })
})

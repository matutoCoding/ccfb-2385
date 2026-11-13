import type { RawGeometry } from '@/types/contour'

export interface PrismOptions {
  outer?: number
  inner?: number
  length?: number
  nodeId?: string
}

// 外方 10、内孔 6、长 20 的毫米制空心棱柱，仅在端面 z=0/z=length 保留顶点环。
// 侧壁与端面环带均为跨越全长/全宽的长三角形：任意 z 切面都真实切穿三角形，
// 交点由线性插值产生并经点池量化，覆盖"交点与顶点重合"的数值路径。
export function hollow_prism(options: PrismOptions = {}): RawGeometry {
  const outer = options.outer ?? 10
  const inner = options.inner ?? 6
  const length = options.length ?? 20
  const half_outer = outer / 2
  const half_inner = inner / 2

  // 每环 8 个顶点：外环 4 角 + 内环 4 角，顺序固定
  const ring_template: Array<[number, number]> = [
    [-half_outer, -half_outer],
    [half_outer, -half_outer],
    [half_outer, half_outer],
    [-half_outer, half_outer],
    [-half_inner, -half_inner],
    [half_inner, -half_inner],
    [half_inner, half_inner],
    [-half_inner, half_inner],
  ]

  const positions: number[] = []
  for (const z of [0, length]) {
    for (const [x, y] of ring_template) positions.push(x, y, z)
  }

  const vid = (level: number, corner: number): number => level * 8 + corner
  const index: number[] = []
  const quad = (a: number, b: number, c: number, d: number): void => {
    index.push(a, b, c, a, c, d)
  }

  // 外侧壁：外角 0..3
  for (let k = 0; k < 4; k += 1) {
    const next = (k + 1) % 4
    quad(vid(0, k), vid(1, k), vid(1, next), vid(0, next))
  }
  // 内侧壁：内角 4..7，绕序反向使法线朝孔内
  for (let k = 0; k < 4; k += 1) {
    const next = (k + 1) % 4
    quad(vid(0, 4 + k), vid(0, 4 + next), vid(1, 4 + next), vid(1, 4 + k))
  }

  // 端面环带：外四角与内四角之间，底面/顶面绕序相反保证法线朝外
  const cap_quad = (level: number, outer_corner: number, inner_corner: number): void => {
    const o = vid(level, outer_corner)
    const on = vid(level, (outer_corner + 1) % 4)
    const hole = vid(level, 4 + inner_corner)
    const hn = vid(level, 4 + ((inner_corner + 1) % 4))
    if (level === 0) {
      index.push(o, on, hole, on, hn, hole)
    } else {
      index.push(o, hole, on, on, hole, hn)
    }
  }
  for (let k = 0; k < 4; k += 1) {
    cap_quad(0, k, k)
    cap_quad(1, k, k)
  }

  return {
    nodeId: options.nodeId ?? 'fixture-square-tube',
    positions: Float32Array.from(positions),
    index: Uint32Array.from(index),
  }
}

export const FIXTURE_THEORETICAL_AREA = 64

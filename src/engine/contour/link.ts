import type { Vec3 } from '@/types/contour'

import type { Segment } from './point_pool'

export interface RawLoop {
  pointIds: number[]
  open: boolean
}

// 无向边键：小 id 在前，保证 a-b 与 b-a 同键
const edge_key = (a: number, b: number): string => (a < b ? `${a}_${b}` : `${b}_${a}`)

// 把线段链接成闭合环；度异常的开口链不参与面积，仅作诊断
export function link_segments(segments: Segment[]): RawLoop[] {
  const adjacency = new Map<number, number[]>()
  const used_edges = new Set<string>()

  const connect = (a: number, b: number) => {
    const list = adjacency.get(a) ?? []
    list.push(b)
    adjacency.set(a, list)
  }
  for (const segment of segments) {
    connect(segment.a, segment.b)
    connect(segment.b, segment.a)
  }
  // 确定性：每个顶点的邻接 id 升序，选边结果与输入顺序无关
  for (const list of adjacency.values()) list.sort((a, b) => a - b)

  const starts = [...adjacency.keys()].sort((a, b) => a - b)
  const loops: RawLoop[] = []

  for (const start of starts) {
    let current = start
    const ring: number[] = []
    let open = false

    while (true) {
      ring.push(current)
      const next = adjacency
        .get(current)
        ?.find((neighbor) => !used_edges.has(edge_key(current, neighbor)))
      if (next === undefined) {
        open = ring.length > 1
        break
      }
      used_edges.add(edge_key(current, next))
      current = next
      if (current === start) break
      if (ring.length > adjacency.size + 1) {
        // 非流形保护：避免异常网格死循环
        open = true
        break
      }
    }

    if (ring.length >= 3) loops.push({ pointIds: ring, open })
  }

  return loops
}

// 按 id 取回环上的世界坐标
export function loop_world_points(ids: number[], points: Vec3[]): Vec3[] {
  return ids.map((id) => points[id])
}

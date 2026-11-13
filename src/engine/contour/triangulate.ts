import type { ContourLoop } from '@/types/contour'

import { ContourError } from '@/types/contour'
import { earcut } from '@/libs'

// 线段相交（不含端点相接），用于自交预检
function segments_cross(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number],
): boolean {
  const orient = (
    a: [number, number],
    b: [number, number],
    c: [number, number],
  ): number => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const o1 = orient(p1, p2, p3)
  const o2 = orient(p1, p2, p4)
  const o3 = orient(p3, p4, p1)
  const o4 = orient(p3, p4, p2)
  return o1 * o2 < 0 && o3 * o4 < 0
}

function has_self_intersection(points: Array<[number, number]>): boolean {
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    for (let j = i + 2; j < points.length; j += 1) {
      if (i === 0 && j === points.length - 1) continue
      if (segments_cross(a, b, points[j], points[(j + 1) % points.length])) return true
    }
  }
  return false
}

// 对外环 + 其孔洞做 earcut 三角化；索引相对于传入环拼接后的展平数组
export function triangulate_group(group: ContourLoop[]): number[] {
  const closed = group.filter((loop) => !loop.open)
  for (const loop of closed) {
    if (has_self_intersection(loop.points2d)) {
      throw new ContourError('SELF_INTERSECTING', `轮廓自相交，拒绝三角化：${loop.id}`)
    }
  }

  const data: number[] = []
  const hole_indices: number[] = []
  for (const loop of closed) {
    if (loop.kind === 'hole') hole_indices.push(data.length / 2)
    for (const [u, v] of loop.points2d) data.push(u, v)
  }

  const triangles = earcut(data, hole_indices, 2)
  const deviation = earcut.deviation(data, hole_indices, 2, triangles)
  // 偏差相对面积可忽略时通过；阈值为外环尺度的百万分之一
  const scale = Math.max(...closed.map((l) => Math.abs(l.signedArea)), 1)
  if (deviation > scale * 1e-6) {
    throw new ContourError('SELF_INTERSECTING', `三角化质量偏差超阈：${deviation.toExponential(3)}`)
  }
  return triangles
}

import type { RawGeometry, Vec3 } from '@/types/contour'

import { identity_matrix, lerp, transform_point } from './math3d'
import { classify, Plane3 } from './plane'
import { PointPool, type Segment } from './point_pool'

const TRI_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 0],
]

function triangle_indices(geometry: RawGeometry): number[] {
  if (geometry.index) return Array.from(geometry.index)
  return Array.from({ length: geometry.positions.length / 3 }, (_, i) => i)
}

function read_vertex(geometry: RawGeometry, index: number, matrix: number[]): Vec3 {
  const base = index * 3
  const local: Vec3 = {
    x: geometry.positions[base],
    y: geometry.positions[base + 1],
    z: geometry.positions[base + 2],
  }
  return transform_point(matrix, local)
}

// 单个网格与平面求交，返回量化线段；顶点落面时直接取顶点并由点池去重
export function intersect_geometry(
  geometry: RawGeometry,
  plane: Plane3,
  eps: number,
  pool: PointPool,
): Segment[] {
  const matrix = geometry.matrix ?? identity_matrix()
  const indices = triangle_indices(geometry)
  const segments: Segment[] = []

  for (let t = 0; t < indices.length; t += 3) {
    const tri = [indices[t], indices[t + 1], indices[t + 2]]
    const verts = tri.map((i) => read_vertex(geometry, i, matrix))
    const distances = verts.map((v) => plane.distance_to(v))
    const signs = distances.map((d) => classify(d, eps))

    // 整面在同侧或完全共面：共面三角形不产生交线
    if (signs.every((s) => s >= 0) || signs.every((s) => s <= 0)) continue

    const hits: Vec3[] = []
    for (const [i, j] of TRI_EDGES) {
      if (signs[i] === signs[j]) continue
      if (signs[i] === 0) {
        hits.push(verts[i])
        continue
      }
      if (signs[j] === 0) {
        hits.push(verts[j])
        continue
      }
      // 跨面：d=0 的线性插值参数
      const ratio = distances[i] / (distances[i] - distances[j])
      hits.push(lerp(verts[i], verts[j], ratio))
    }

    const ids = Array.from(new Set(hits.map((p) => pool.intern(p))))
    if (ids.length >= 2) segments.push({ a: ids[0], b: ids[1] })
  }

  return segments
}

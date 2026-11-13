import type {
  AxisId,
  ContourLoop,
  RawGeometry,
  SectionContour,
  Vec3,
} from '@/types/contour'

import { ContourError } from '@/types/contour'

import { classify_loops, net_area } from './classify'
import { intersect_geometry } from './intersect'
import { link_segments, loop_world_points } from './link'
import { compute_eps, identity_matrix } from './math3d'
import { axis_plane, Plane3 } from './plane'
import { PointPool } from './point_pool'
import { make_basis, project_2d, signed_area_2d } from './project2d'
import { triangulate_group } from './triangulate'

export interface ContourOptions {
  planeId: string
  axis: AxisId
  distance: number
  flip?: boolean
  eps?: number
  areaTol?: number
}

// 包围盒对角，用于默认 eps 缩放
export function geometry_diagonal(geometries: RawGeometry[]): number {
  let min: Vec3 = { x: Infinity, y: Infinity, z: Infinity }
  let max: Vec3 = { x: -Infinity, y: -Infinity, z: -Infinity }
  for (const geometry of geometries) {
    const matrix = geometry.matrix ?? identity_matrix()
    for (let i = 0; i < geometry.positions.length; i += 3) {
      const local = {
        x: geometry.positions[i],
        y: geometry.positions[i + 1],
        z: geometry.positions[i + 2],
      }
      const p = transform(matrix, local)
      min = { x: Math.min(min.x, p.x), y: Math.min(min.y, p.y), z: Math.min(min.z, p.z) }
      max = { x: Math.max(max.x, p.x), y: Math.max(max.y, p.y), z: Math.max(max.z, p.z) }
    }
  }
  return Math.hypot(max.x - min.x, max.y - min.y, max.z - min.z)
}

function transform(m: number[], p: Vec3): Vec3 {
  return {
    x: m[0] * p.x + m[4] * p.y + m[8] * p.z + m[12],
    y: m[1] * p.x + m[5] * p.y + m[9] * p.z + m[13],
    z: m[2] * p.x + m[6] * p.y + m[10] * p.z + m[14],
  }
}

// 轮廓提取主入口：纯函数，同输入逐位相等，可在 node 下完整测试
export function extract_contour(
  geometries: RawGeometry[],
  options: ContourOptions,
): SectionContour {
  const ordered = [...geometries].sort((a, b) => a.nodeId.localeCompare(b.nodeId))
  const eps = options.eps ?? compute_eps(geometry_diagonal(ordered))
  const areaTol = options.areaTol ?? 1e-6
  const plane: Plane3 = axis_plane(options.axis, options.distance, options.flip ?? false)
  const pool = new PointPool(eps)
  const node_by_point = new Map<number, string>()

  // 单次遍历：求交的同时记录每个新量化点来自哪个零件
  const all_segments = ordered.flatMap((geometry) => {
    const before = pool.point_list.length
    const result = intersect_geometry(geometry, plane, eps, pool)
    pool.point_list.slice(before).forEach((_, offset) => {
      node_by_point.set(before + offset, geometry.nodeId)
    })
    return result
  })
  if (all_segments.length === 0) {
    throw new ContourError('EMPTY_CUT', '平面未切到任何网格')
  }

  const basis = make_basis(plane.normal)
  const raw_loops = link_segments(all_segments)
  const loops: ContourLoop[] = raw_loops.map((raw, index) => {
    const world = loop_world_points(raw.pointIds, pool.point_list)
    const points2d = world.map((p) => project_2d(p, basis))
    return {
      id: `${options.planeId}-loop-${index}`,
      nodeId: node_by_point.get(raw.pointIds[0]) ?? 'unknown',
      pointIds: raw.pointIds,
      worldPoints: world,
      points2d,
      signedArea: signed_area_2d(points2d),
      kind: 'outer',
      open: raw.open,
    }
  })

  const classified = classify_loops(loops)
  const closed_loops = classified.filter((loop) => !loop.open)
  const triangles = closed_loops.length ? triangulate_group(closed_loops) : []
  const areas = net_area(classified)

  return {
    planeId: options.planeId,
    axis: options.axis,
    loops: classified,
    triangles,
    outerArea: areas.outer,
    holeArea: areas.hole,
    capArea: areas.net,
    tolerance: { eps, areaTol },
  }
}

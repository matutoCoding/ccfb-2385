import type { Vec3 } from '@/types/contour'

import { cross, dot, normalize } from './math3d'

export interface PlaneBasis {
  u: Vec3
  v: Vec3
}

// 以平面法线构造右手正交基；轴切面下即另外两个世界轴，面积不受基翻转影响
export function make_basis(normal: Vec3): PlaneBasis {
  const reference: Vec3 =
    Math.abs(normal.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 }
  const u = normalize(cross(reference, normal))
  const v = normalize(cross(normal, u))
  return { u, v }
}

export const project_2d = (p: Vec3, basis: PlaneBasis): [number, number] => [
  dot(p, basis.u),
  dot(p, basis.v),
]

// shoelace 有符号面积；外环相对法线为正、孔洞为负（具体符号由环绕方向决定）
export function signed_area_2d(points: Array<[number, number]>): number {
  let sum = 0
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % points.length]
    sum += x1 * y2 - x2 * y1
  }
  return sum / 2
}

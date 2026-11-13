import type { AxisId, SectionPlaneState, Vec3 } from '@/types/contour'

// 三维平面：normal·p + constant = 0，normal 为单位向量
export class Plane3 {
  constructor(
    readonly normal: Vec3,
    readonly constant: number,
  ) {}

  distance_to(p: Vec3): number {
    return this.normal.x * p.x + this.normal.y * p.y + this.normal.z * p.z + this.constant
  }
}

const AXIS_NORMAL: Record<AxisId, Vec3> = {
  x: { x: 1, y: 0, z: 0 },
  y: { x: 0, y: 1, z: 0 },
  z: { x: 0, y: 0, z: 1 },
}

// 世界轴切面：平面过轴坐标 distance 处，flip 翻转法线（normal·p = distance）
export function axis_plane(axis: AxisId, distance: number, flip = false): Plane3 {
  const base = AXIS_NORMAL[axis]
  const normal: Vec3 = flip
    ? { x: -base.x, y: -base.y, z: -base.z }
    : { x: base.x, y: base.y, z: base.z }
  // 翻转后平面位置不变，仅法线反向：constant = -normal_axis * distance
  return new Plane3(normal, -normal[axis] * distance)
}

// 状态 → 运行时平面的唯一入口，保证持久化往返一致
export function plane_from_state(state: SectionPlaneState): Plane3 {
  return axis_plane(state.axis, state.distance, state.flip)
}

// 距离分类：|d| <= eps 吸附为 0；零值统一按正号处理，消除过顶点歧义
export function classify(d: number, eps: number): -1 | 0 | 1 {
  if (Math.abs(d) <= eps) return 0
  return d > 0 ? 1 : -1
}

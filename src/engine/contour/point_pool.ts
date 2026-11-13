import type { Vec3 } from '@/types/contour'

// eps 网格量化点池：同坐标（容差内）永远拿到同一 id，与遍历顺序无关
export class PointPool {
  private readonly grid = new Map<string, number>()
  private readonly points: Vec3[] = []

  constructor(private readonly eps: number) {}

  intern(p: Vec3): number {
    const q = 1 / this.eps
    const key = `${Math.round(p.x * q)},${Math.round(p.y * q)},${Math.round(p.z * q)}`
    const existing = this.grid.get(key)
    if (existing !== undefined) return existing
    const id = this.points.length
    this.points.push(p)
    this.grid.set(key, id)
    return id
  }

  get point_list(): Vec3[] {
    return this.points
  }
}

// 一段交线：两个量化后的点 id
export interface Segment {
  a: number
  b: number
}

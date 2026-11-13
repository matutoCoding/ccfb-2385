import type { ContourLoop } from '@/types/contour'

// 射线法点在多边形内（2D），点取环首点即可判定嵌套归属
export function point_in_polygon(point: [number, number], polygon: Array<[number, number]>): boolean {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

// 按嵌套深度分类：不被任何环包含为外环，被奇数个外环包含为孔洞
export function classify_loops(loops: ContourLoop[]): ContourLoop[] {
  const sorted = [...loops].sort((a, b) => Math.abs(b.signedArea) - Math.abs(a.signedArea))
  return sorted.map((loop) => {
    const container_count = sorted.filter(
      (other) =>
        other !== loop &&
        Math.abs(other.signedArea) > Math.abs(loop.signedArea) &&
        point_in_polygon(loop.points2d[0], other.points2d),
    ).length
    return { ...loop, kind: container_count % 2 === 1 ? 'hole' : 'outer' } as ContourLoop
  })
}

// 实体截面 = 外环面积和 − 孔洞面积和；夹具即 100 − 36 = 64
export function net_area(loops: ContourLoop[]): { outer: number; hole: number; net: number } {
  const outer = loops.filter((l) => l.kind === 'outer' && !l.open).reduce((s, l) => s + Math.abs(l.signedArea), 0)
  const hole = loops.filter((l) => l.kind === 'hole' && !l.open).reduce((s, l) => s + Math.abs(l.signedArea), 0)
  return { outer, hole, net: outer - hole }
}

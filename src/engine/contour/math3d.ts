import type { Vec3 } from '@/types/contour'

// 最小三维数学工具，引擎内部使用，不依赖 three

export const vec = (x: number, y: number, z: number): Vec3 => ({ x, y, z })

export const add = (a: Vec3, b: Vec3): Vec3 => vec(a.x + b.x, a.y + b.y, a.z + b.z)

export const sub = (a: Vec3, b: Vec3): Vec3 => vec(a.x - b.x, a.y - b.y, a.z - b.z)

export const scale = (a: Vec3, s: number): Vec3 => vec(a.x * s, a.y * s, a.z * s)

export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z

export const cross = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)

export const length = (a: Vec3): number => Math.sqrt(dot(a, a))

export const normalize = (a: Vec3): Vec3 => {
  const len = length(a)
  return len === 0 ? vec(0, 0, 0) : scale(a, 1 / len)
}

export const lerp = (a: Vec3, b: Vec3, t: number): Vec3 =>
  vec(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t)

// 列主序 mat4 仿射变换：world = m * [x,y,z,1]
export function transform_point(m: number[], p: Vec3): Vec3 {
  return vec(
    m[0] * p.x + m[4] * p.y + m[8] * p.z + m[12],
    m[1] * p.x + m[5] * p.y + m[9] * p.z + m[13],
    m[2] * p.x + m[6] * p.y + m[10] * p.z + m[14],
  )
}

export const identity_matrix = (): number[] => [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]

// 吸附阈值：随包围盒对角缩放并夹在绝对上下限之间，随工程持久化
export function compute_eps(diagonal: number): number {
  return Math.min(1e-5, Math.max(1e-9, 1e-7 * diagonal))
}

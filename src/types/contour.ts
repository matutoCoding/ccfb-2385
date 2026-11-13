// 剖切与轮廓相关的可序列化类型，引擎层与状态层共用

export type AxisId = 'x' | 'y' | 'z'

export interface Vec3 {
  x: number
  y: number
  z: number
}

// 切面状态：只存轴向距离毫米值与翻转位，运行时才推导平面，保证重开不漂移
export interface SectionPlaneState {
  id: string
  axis: AxisId
  distance: number
  flip: boolean
  enabled: boolean
}

// 引擎可消费的纯几何输入，matrix 为列主序 mat4 的局部到世界变换
export interface RawGeometry {
  nodeId: string
  positions: Float32Array | number[]
  index?: Uint32Array | number[]
  matrix?: number[]
}

export interface ContourLoop {
  id: string
  nodeId: string
  pointIds: number[]
  worldPoints: Vec3[]
  points2d: [number, number][]
  signedArea: number
  kind: 'outer' | 'hole'
  open: boolean
}

export interface ContourTolerance {
  eps: number
  areaTol: number
}

export interface SectionContour {
  planeId: string
  axis: AxisId
  loops: ContourLoop[]
  // earcut 展平索引，按 pointIds 下标引用；开口环不参与
  triangles: number[]
  outerArea: number
  holeArea: number
  capArea: number
  tolerance: ContourTolerance
}

export class ContourError extends Error {
  constructor(
    readonly code: 'SELF_INTERSECTING' | 'OPEN_LOOP' | 'EMPTY_CUT',
    message: string,
  ) {
    super(message)
    this.name = 'ContourError'
  }
}

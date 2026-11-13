import { describe, expect, it } from 'vitest'

import { axis_plane, plane_from_state } from '@/engine/contour/plane'

describe('切面状态往返', () => {
  it('轴平面方程满足 normal·p = distance', () => {
    const plane = axis_plane('z', 12.5)
    expect(plane.distance_to({ x: 0, y: 0, z: 12.5 })).toBeCloseTo(0, 12)
    expect(plane.distance_to({ x: 0, y: 0, z: 13.5 })).toBeCloseTo(1, 12)
  })

  it('flip 只反法线不改平面位置', () => {
    const normal = axis_plane('x', 4)
    const flipped = axis_plane('x', 4, true)
    expect(flipped.distance_to({ x: 4, y: 0, z: 0 })).toBeCloseTo(0, 12)
    expect(flipped.distance_to({ x: 5, y: 0, z: 0 })).toBeCloseTo(-1, 12)
    expect(normal.distance_to({ x: 5, y: 0, z: 0 })).toBeCloseTo(1, 12)
  })

  it('状态推导与直接构造一致，保证重开不漂移', () => {
    const state = { id: 's1', axis: 'y' as const, distance: -3.25, flip: true, enabled: true }
    const from_state = plane_from_state(state)
    const direct = axis_plane('y', -3.25, true)
    expect(from_state.normal).toEqual(direct.normal)
    expect(from_state.constant).toBe(direct.constant)
  })
})

import { describe, expect, it } from 'vitest'

import { ContourError } from '@/types/contour'
import { extract_contour } from '@/engine/contour/contour_engine'
import { hollow_prism, FIXTURE_THEORETICAL_AREA } from '@/engine/fixture/hollow_prism'

const AREA_TOL = 1e-6

describe('空心棱柱剖面面积', () => {
  const geometry = [hollow_prism()]

  it('普通位置切面净面积等于 64mm²', () => {
    const contour = extract_contour(geometry, {
      planeId: 'p-mid',
      axis: 'z',
      distance: 7,
    })
    expect(contour.capArea).toBeCloseTo(64, 9)
    expect(contour.outerArea).toBeCloseTo(100, 9)
    expect(contour.holeArea).toBeCloseTo(36, 9)
    expect(contour.capArea).toBeCloseTo(FIXTURE_THEORETICAL_AREA, 9)
  })

  it.each([1, 5, 10, 15, 19])('内部 z=%s 切面面积恒为 64 且为一外一孔两环', (distance) => {
    const contour = extract_contour(geometry, {
      planeId: `p-z-${distance}`,
      axis: 'z',
      distance,
    })
    expect(contour.capArea).toBeCloseTo(64, AREA_TOL)
    expect(contour.loops).toHaveLength(2)
    expect(contour.loops.filter((loop) => loop.kind === 'outer')).toHaveLength(1)
    expect(contour.loops.filter((loop) => loop.kind === 'hole')).toHaveLength(1)
  })

  it('切面恰在端面 z=0/z=20 时按空切处理（无几何可切）', () => {
    for (const distance of [0, 20]) {
      expect(() =>
        extract_contour(geometry, { planeId: `p-edge-${distance}`, axis: 'z', distance }),
      ).toThrow(ContourError)
    }
  })

  it('同一切面连算 100 次结果逐位相等（确定性）', () => {
    const first = extract_contour(geometry, { planeId: 'p', axis: 'z', distance: 10 })
    for (let i = 0; i < 100; i += 1) {
      const again = extract_contour(geometry, { planeId: 'p', axis: 'z', distance: 10 })
      expect(again.capArea).toBe(first.capArea)
      expect(again.loops.map((loop) => loop.pointIds)).toEqual(
        first.loops.map((loop) => loop.pointIds),
      )
    }
  })

  it('量化点池无重复坐标', () => {
    const contour = extract_contour(geometry, { planeId: 'p', axis: 'z', distance: 10 })
    const keys = contour.loops.flatMap((loop) =>
      loop.worldPoints.map((p) => `${p.x},${p.y},${p.z}`),
    )
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('翻转法线不改变面积与环数', () => {
    const normal = extract_contour(geometry, { planeId: 'a', axis: 'z', distance: 8 })
    const flipped = extract_contour(geometry, {
      planeId: 'b',
      axis: 'z',
      distance: 8,
      flip: true,
    })
    expect(flipped.capArea).toBeCloseTo(normal.capArea, 12)
    expect(flipped.loops).toHaveLength(normal.loops.length)
  })

  it('x/y 轴向切穿全长侧壁，截面为 20×10 减 20×6 = 80mm²', () => {
    const cut_x = extract_contour(geometry, { planeId: 'x', axis: 'x', distance: 0 })
    const cut_y = extract_contour(geometry, { planeId: 'y', axis: 'y', distance: 2 })
    expect(cut_x.capArea).toBeCloseTo(80, AREA_TOL)
    expect(cut_y.capArea).toBeCloseTo(80, AREA_TOL)
  })

  it('世界平移后内切面面积不变', () => {
    const moved = hollow_prism()
    moved.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 12.5, -7.25, 3.5, 1]
    // 平移后内腔 z 范围 3.5..23.5，取内部 13.5
    const contour = extract_contour([moved], { planeId: 'p', axis: 'z', distance: 13.5 })
    expect(contour.capArea).toBeCloseTo(64, AREA_TOL)
  })

  it('切在模型外抛出 EMPTY_CUT', () => {
    expect(() =>
      extract_contour(geometry, { planeId: 'empty', axis: 'z', distance: 999 }),
    ).toThrow(/未切到/)
  })
})

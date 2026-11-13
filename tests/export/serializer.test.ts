import { describe, expect, it } from 'vitest'

import { extract_contour } from '@/engine/contour/contour_engine'
import { parse_dxf } from '@/engine/export/dxf_reader'
import { to_dxf } from '@/engine/export/dxf_serializer'
import { to_svg } from '@/engine/export/svg_serializer'
import { hollow_prism } from '@/engine/fixture/hollow_prism'

describe('剖面轮廓导出', () => {
  const contour = extract_contour([hollow_prism()], {
    planeId: 'p',
    axis: 'z',
    distance: 10,
  })

  it('DXF 声明毫米单位并回读出两条闭合多段线', () => {
    const dxf = to_dxf(contour)
    const parsed = parse_dxf(dxf)
    expect(parsed.insUnits).toBe(4)
    expect(parsed.entities).toHaveLength(2)
    expect(parsed.entities.every((entity) => entity.closed)).toBe(true)
    const layers = parsed.entities.map((entity) => entity.layer).sort()
    expect(layers).toEqual(['CONTOUR', 'HOLES'])
    const outer = parsed.entities.find((entity) => entity.layer === 'CONTOUR')
    expect(outer?.points).toHaveLength(4)
  })

  it('DXF 使用 CRLF 且无科学计数法', () => {
    const dxf = to_dxf(contour)
    expect(dxf.includes('\r\n')).toBe(true)
    expect(/e[+-]?\d/iu.test(dxf)).toBe(false)
  })

  it('SVG 含 evenodd 填充规则与毫米单位', () => {
    const svg = to_svg(contour)
    expect(svg).toContain('fill-rule="evenodd"')
    expect(svg).toContain('unit="mm"')
    expect(svg).toContain('<svg')
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
  })

  it('同一轮廓两次序列化字节一致（golden 稳定性）', () => {
    expect(to_dxf(contour)).toBe(to_dxf(contour))
    expect(to_svg(contour)).toBe(to_svg(contour))
  })
})

export interface DxfEntity {
  type: string
  layer: string
  closed: boolean
  points: Array<[number, number]>
}

// 极简 group-code 回读解析，仅供测试校验 DXF 结构与数值
export function parse_dxf(text: string): { insUnits: number; entities: DxfEntity[] } {
  const lines = text.split(/\r?\n/)
  const codes: Array<{ code: number; value: string }> = []
  for (let i = 0; i < lines.length - 1; i += 2) {
    codes.push({ code: Number(lines[i]), value: lines[i + 1] })
  }

  let insUnits = 0
  for (let i = 0; i < codes.length; i += 1) {
    if (codes[i].code === 9 && codes[i].value === '$INSUNITS') {
      insUnits = Number(codes[i + 1].value)
      break
    }
  }

  const entities: DxfEntity[] = []
  for (let i = 0; i < codes.length; i += 1) {
    if (codes[i].code !== 0 || codes[i].value !== 'LWPOLYLINE') continue
    const entity: DxfEntity = { type: 'LWPOLYLINE', layer: '', closed: false, points: [] }
    let j = i + 1
    for (; j < codes.length && codes[j].code !== 0; j += 1) {
      const { code, value } = codes[j]
      if (code === 8) entity.layer = value
      if (code === 70) entity.closed = Number(value) === 1
      if (code === 10) entity.points.push([Number(value), Number(codes[j + 1].value)])
    }
    entities.push(entity)
    i = j - 1
  }

  return { insUnits, entities }
}

import type { SectionContour } from '@/types/contour'

import { fixed6 } from './format'

interface Pair {
  code: number
  value: string
}

const pair = (code: number, value: string | number): Pair => ({
  code,
  value: String(value),
})

// 极简 DXF：HEADER 声明毫米单位，ENTITIES 每环一条闭合 LWPOLYLINE
export function to_dxf(contour: SectionContour): string {
  const pairs: Pair[] = []
  const add = (code: number, value: string | number): void => pairs.push(pair(code, value))

  add(0, 'SECTION')
  add(2, 'HEADER')
  add(9, '$INSUNITS')
  add(70, 4)
  add(9, '$LUNITS')
  add(70, 2)
  add(9, '$LUPREC')
  add(70, 6)
  add(0, 'ENDSEC')

  add(0, 'SECTION')
  add(2, 'TABLES')
  add(0, 'TABLE')
  add(2, 'LAYER')
  add(70, 2)
  for (const layer of ['CONTOUR', 'HOLES']) {
    add(0, 'LAYER')
    add(2, layer)
    add(70, 0)
    add(62, 7)
    add(6, 'CONTINUOUS')
  }
  add(0, 'ENDTAB')
  add(0, 'ENDSEC')

  add(0, 'SECTION')
  add(2, 'ENTITIES')
  for (const loop of contour.loops) {
    if (loop.open) continue
    add(0, 'LWPOLYLINE')
    add(8, loop.kind === 'hole' ? 'HOLES' : 'CONTOUR')
    add(70, 1)
    add(90, loop.points2d.length)
    for (const [u, v] of loop.points2d) {
      add(10, fixed6(u))
      add(20, fixed6(v))
    }
  }
  add(0, 'ENDSEC')
  add(0, 'EOF')

  return pairs.map((item) => `${item.code}\r\n${item.value}`).join('\r\n') + '\r\n'
}

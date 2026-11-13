import type { SectionContour } from '@/types/contour'

import { fixed6, loops_to_path } from './format'

// SVG 序列化：毫米单位，viewBox 按轮廓包围盒自适应留白
export function to_svg(contour: SectionContour): string {
  const closed = contour.loops.filter((loop) => !loop.open)
  const us = closed.flatMap((loop) => loop.points2d.map(([u]) => u))
  const vs = closed.flatMap((loop) => loop.points2d.map(([, v]) => v))
  const min_u = Math.min(...us)
  const max_u = Math.max(...us)
  const min_v = Math.min(...vs)
  const max_v = Math.max(...vs)
  const padding = 2
  const width = max_u - min_u + padding * 2
  const height = max_v - min_v + padding * 2

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" unit="mm"',
    ` viewBox="${fixed6(min_u - padding)} ${fixed6(min_v - padding)} ${fixed6(width)} ${fixed6(height)}">`,
    `  <path fill-rule="evenodd" fill="#3b82f6" fill-opacity="0.35" stroke="#1d4ed8"`,
    `    stroke-width="0.15" d="${loops_to_path(closed)}" />`,
    '</svg>',
  ].join('\n')
}

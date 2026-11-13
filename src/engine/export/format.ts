// 导出共用的定点数格式：6 位小数，杜绝科学计数法与浮点长尾
export function fixed6(value: number): string {
  const rounded = Math.abs(value) < 5e-7 ? 0 : value
  return rounded.toFixed(6)
}

// SVG 路径数据：外环与孔环同 path，fill-rule=evenodd 自然镂空
export function loops_to_path(loops: Array<{ points2d: Array<[number, number]> }>): string {
  return loops
    .map((loop) => {
      const moves = loop.points2d
        .map(([u, v], index) => `${index === 0 ? 'M' : 'L'}${fixed6(u)},${fixed6(v)}`)
        .join(' ')
      return `${moves} Z`
    })
    .join(' ')
}

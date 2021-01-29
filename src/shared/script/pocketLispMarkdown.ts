export function interpretMarkdown(interpret: (src: string) => unknown, source: string): string {
  return (source ?? '').toString().replace(/@(.+?)@/g, (match, code: string) => {
    try {
      const result = interpret(code) as Record<string, unknown>
      return result?.toString()
    } catch (e) {
      return `\`[Eval of "${code}" failed: ${e.message}\``
    }
  })
}

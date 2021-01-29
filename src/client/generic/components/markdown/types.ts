export type MarkdownString = string

export interface MarkdownProps {
  className?: string
  source: MarkdownString
  mark?: string
  onWikiLink?: (wikiPageId: string) => void
  options?: unknown
}

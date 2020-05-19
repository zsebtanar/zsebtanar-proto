export type MarkdownString = string

export interface MarkdownResource {
  url: string
  type: string
}

export type MarkdownResources = ObjectMap<MarkdownResource>

export interface MarkdownProps {
  className?: string
  source: MarkdownString
  resources?: MarkdownResources
  mark?: string
  onWikiLink?: (wikiPageId: string) => void
  options?: unknown
}

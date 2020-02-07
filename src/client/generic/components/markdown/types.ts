export type MDString = string

export interface MarkdownResource {
  url: string
  type: string
}

export type MarkdownResources = ObjectMap<MarkdownResource>

export interface MarkdownProps {
  className?: string
  source: MDString
  resources?: MarkdownResources
  mark?: string
  onWikiLink?: (wikiPageId: string) => void
  options?: unknown
}

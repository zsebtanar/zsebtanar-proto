export const TAG_REGEXP = /(<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/gi

const HUN_VOWEL_MAP = {
  a: '[aá]',
  e: '[eé]',
  i: '[ií]',
  o: '[oóöő]',
  u: '[uúüű]',
  A: '[AÁ]',
  E: '[EÉ]',
  I: '[IÍ]',
  O: '[OÓÖŐ]',
  U: '[UÚÜŰ]'
}

export const matchAllHunVowel = text => text.replace(/[aeiou]/gi, x => HUN_VOWEL_MAP[x])

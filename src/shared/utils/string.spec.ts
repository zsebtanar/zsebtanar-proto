import { matchAllHunVowel, TAG_REGEXP } from 'shared/utils/string'

test('tag match regexp', () => {
  expect('<div>Hello world</div>'.split(TAG_REGEXP)).toMatchInlineSnapshot(`
    Array [
      "",
      "<div>",
      "Hello world",
      "</div>",
      "",
    ]
  `)
})

test('matchAllHunVowel behaviour', () => {
  expect(matchAllHunVowel('Hello world')).toBe('H[eé]ll[oóöő] w[oóöő]rld')

  expect(matchAllHunVowel('a|e|i|o|u|A|E|I|O|U')).toBe(
    '[aá]|[eé]|[ií]|[oóöő]|[uúüű]|[AÁ]|[EÉ]|[IÍ]|[OÓÖŐ]|[UÚÜŰ]'
  )
})

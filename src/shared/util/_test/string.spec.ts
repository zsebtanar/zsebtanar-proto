
import { matchAllHunVowel } from '../string'

describe('matchAllHunVowel', () => {
  it('should not the text if it is not contains vowels', () => {
    const actual = matchAllHunVowel('xyz')
    const expected = 'xyz'
    expect(actual).toEqual(expected)
  })

  describe('should replace all vowels without accent with the original + the hun vowel variant regexp', () => {
    it('lowercase', () => {
      const actual = matchAllHunVowel('a e i o u')
      const expected = '[aá] [eé] [ií] [oóöő] [uúüű]'
      expect(actual).toEqual(expected)
    })
    it('lowercase', () => {
      const actual = matchAllHunVowel('A E I O U')
      const expected = '[AÁ] [EÉ] [IÍ] [OÓÖŐ] [UÚÜŰ]'
      expect(actual).toEqual(expected)
    })
  })

  it('should not replace vowels with accent', () => {
    const actual = matchAllHunVowel('árvíztűrő tükörfúrógép')
    const expected = 'árvíztűrő tükörfúrógép'
    expect(actual).toEqual(expected)
  })
})

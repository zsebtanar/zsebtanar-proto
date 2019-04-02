import { unTokeniseMarkdown } from 'server/utils/markdown'

describe('markdown', () => {
  describe('unTokeniseMarkdown', () => {
    it('should do nothing with empty string', () => {
      expect(unTokeniseMarkdown('')).toBe('')
    })

    it('should do nothing none markdown string', () => {
      expect(unTokeniseMarkdown('hello world')).toBe('hello world')
    })

    it('should remove basic tokens', () => {
      const text = `**bold** *italic*`
      const result = 'bold italic'
      expect(unTokeniseMarkdown(text)).toBe(result)
    })

    it('should remove links', () => {
      const text = `[link](http://google.com)`
      const result = 'link'
      expect(unTokeniseMarkdown(text)).toBe(result)
    })

    it('should math tags', () => {
      const text = `a $1-2$ b`
      const result = 'a b'
      expect(unTokeniseMarkdown(text)).toBe(result)
    })

    it('should clean complex text', () => {
      const text = `**Szorozzuk meg** mindkét *oldalt* $-1$-gyel:
$$x+2=-2$$
Vonjunk ki mindkét oldalból $2$-t!:
$$x=-2-2=-4$$
Tehát a másik megoldás $-4$.`
      const result =
        'szorozzuk meg mindkét oldalt vonjunk ki mindkét oldalból tehát a másik megoldás'
      expect(unTokeniseMarkdown(text)).toBe(result)
    })

    it('should clean complex text 2', () => {
      const text = `Adott a valós számok halmazán értelmezett $f$ függvény:

$$f:x\\mapsto(x-1)^2-4.$$

- Számítsa ki az $f$ függvény $x=-5$ helyen felvett helyettesítési értékét!`
      const result =
        'adott a valós számok halmazán értelmezett függvény számítsa ki az függvény helyen felvett helyettesítési értékét'
      expect(unTokeniseMarkdown(text)).toBe(result)
    })
  })
})

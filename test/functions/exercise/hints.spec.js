import nextHint from '../../../functions/src/exercise/hints/nextHint'

describe('nextHint', () => {
  const exerciseId = '-KoYFnzUG0K4dVoqNjuC'
  const exerciseSnapshot = {
    val: function() {
      return {
        _key: exerciseId,
        hints: {
          '5d23953fe2': {
            order: 1,
            text: 'hint 1'
          },
          '5d23c3a715': {
            order: 2,
            text: 'hint 2'
          },
          '5d23d1679e': {
            order: 0,
            text: 'hint 0'
          }
        }
      }
    }
  }

  it('should return with the first hint if the lastHint is not valid hint key', () => {
    expect(nextHint(exerciseId, undefined)(exerciseSnapshot).hint.text).toBe('hint 0')
  })

  it("should return with the next hint if the lastHint is the prev hint' key", () => {
    expect(nextHint(exerciseId, '5d23d1679e')(exerciseSnapshot).hint.text).toBe('hint 1')
    expect(nextHint(exerciseId, '5d23953fe2')(exerciseSnapshot).hint.text).toBe('hint 2')
  })

  it('should return with the false if no more hints', () => {
    expect(nextHint(exerciseId, '5d23c3a715')(exerciseSnapshot).hint).toBe(false)
  })
})

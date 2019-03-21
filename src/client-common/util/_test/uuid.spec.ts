import { uid } from '../uuid'

describe('uid', () => {
  it('generate the right format', () => {
    expect(uid()).toMatch(/[0-9a-f]{10}/)
  })
})

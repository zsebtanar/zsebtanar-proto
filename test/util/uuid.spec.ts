import { guid, uid } from '../../src/client-common/util/uuid'

describe('uid', () => {
  it('generate the right format', () => {
    expect(uid()).toMatch(/[0-9a-f]{10}/)
  })
})

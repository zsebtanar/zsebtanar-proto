import { guid, uid } from '../../src/util/uuid'

describe('guid', () => {
  it('generate the right format', () => {
    expect(guid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
  })
})

describe('uid', () => {
  it('generate the right format', () => {
    expect(uid()).toMatch(/[0-9a-f]{10}/)
  })
})

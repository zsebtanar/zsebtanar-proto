import * as z from 'zod'
import { requestValidator } from './requestValidator'

describe('requestValidator', () => {
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => undefined))
  afterAll(() => jest.restoreAllMocks())

  test(' should accept correct data', () => {
    const mockNext = jest.fn()
    const mockStatus = jest.fn()

    requestValidator({
      params: z.string(),
      query: z.array(z.number()),
      body: z.object({ a: z.number() }),
    })({ params: 'hello world', query: [1], body: { a: 42 } }, { status: mockStatus }, mockNext)

    expect(mockNext).toBeCalledTimes(1)
    expect(mockStatus).toBeCalledTimes(0)
  })

  test('requestValidator should fails with incorrect data', () => {
    const mockNext = jest.fn()
    const mockSend = jest.fn()
    const mockStatus = jest.fn(() => ({ send: mockSend }))

    requestValidator({
      params: z.string(),
      query: z.array(z.number()),
      body: z.object({ a: z.number() }),
    })({}, { status: mockStatus }, mockNext)

    expect(mockNext).toBeCalledTimes(1)
    expect(mockNext.mock.calls[0][0] instanceof Error).toEqual(true)
    expect(mockStatus).toBeCalledTimes(0)
    expect(mockSend).toBeCalledTimes(0)
  })
})

import { UploadedFile } from 'client/file-upload/images'
import {
  RESOURCES_ADD,
  RESOURCES_CLEAN,
  RESOURCES_ERROR,
  RESOURCES_INIT,
  RESOURCES_UPLOADED,
  resourcesReducer
} from 'client/file-upload/resources/resourceReducer'

describe('Resources', () => {
  describe('resourceReducer', () => {
    it('should reduce RESOURCES_INIT into state', () => {
      const action = {
        type: RESOURCES_INIT,
        payload: {
          xyz: {
            url: 'https://...',
            type: 'image'
          }
        } as MarkdownResources
      }
      const state = resourcesReducer(undefined, action)
      expect(state).toEqual({
        error: undefined,
        data: {
          xyz: {
            url: 'https://...',
            type: 'image'
          }
        }
      })
    })

    it('should reduce RESOURCES_ADD into state', () => {
      const action = {
        type: RESOURCES_ADD,
        payload: {
          id: 'xyz',
          file: { name: 'fName', type: 'image/png' },
          url: 'https://...'
        }
      }
      const state = resourcesReducer(undefined, action)
      expect(state).toEqual({
        error: undefined,
        data: {
          xyz: {
            isNew: true,
            url: 'https://...',
            type: 'image/png',
            name: 'fName',
            file: { name: 'fName', type: 'image/png' }
          }
        }
      })
    })

    it('should reduce RESOURCES_CLEAN into state', () => {
      const action = {
        type: RESOURCES_CLEAN
      }
      const state = resourcesReducer(undefined, action)
      expect(state).toEqual({
        error: undefined,
        data: undefined
      })
    })

    it('should reduce RESOURCES_UPLOADED into state', () => {
      const action = {
        type: RESOURCES_UPLOADED,
        payload: {
          xyz: {
            _key: '123',
            fullPath: 'fullpath',
            name: 'fName',
            type: 'image/png',
            url: 'https://...'
          }
        } as ObjectMap<UploadedFile>
      }
      const state = resourcesReducer(undefined, action)
      expect(state).toEqual({
        error: undefined,
        data: {
          xyz: {
            _key: '123',
            fullPath: 'fullpath',
            name: 'fName',
            type: 'image/png',
            url: 'https://...'
          }
        }
      })
    })

    it('should reduce RESOURCES_ERROR into state', () => {
      const action = { type: RESOURCES_ERROR, payload: { message: 'error' } }
      const state = resourcesReducer(undefined, action)
      expect(state).toEqual({ error: { message: 'error' }, data: undefined })
    })
  })
})

import { contains, filter, flip, invoker, lte, map, pipe, prop, propEq } from 'ramda'

export const validFileTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/webp']

export const maxFileSize = 1024 * 1024 * 3 // 3Mb

export const getAsFile = invoker(0, 'getAsFile')

export const clipboardToFile = pipe(
  filter(propEq('kind', 'file')),
  map(getAsFile)
)

export const checkFileType = pipe(
  prop('type'),
  flip(contains)(validFileTypes)
)

export const checkFileSize = pipe(
  prop('size'),
  flip(lte)(maxFileSize)
)

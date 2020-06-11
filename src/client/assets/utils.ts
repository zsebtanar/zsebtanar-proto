export const validFileTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/webp']

export const maxFileSize = 1024 * 1024 * 3 // 3Mb

export const checkFileType = (file: File) => validFileTypes.includes(file.type)

export const checkFileSize = (file: File) => file.size <= maxFileSize

export const fileToUrl = async (file: File) =>
  await new Promise<string>(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader?.result?.toString() ?? '')
    reader.readAsDataURL(file)
  })

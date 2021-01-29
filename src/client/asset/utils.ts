export const validFileTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/webp']

export const maxFileSize = 1024 * 1024 * 3 // 3Mb

export const checkFileType = (file: File): boolean => validFileTypes.includes(file.type)

export const checkFileSize = (file: File): boolean => file.size <= maxFileSize

export const fileToUrl = async (file: File): Promise<string> =>
  await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader?.result?.toString() ?? '')
    reader.readAsDataURL(file)
  })

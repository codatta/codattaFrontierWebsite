import { UploadedImage } from './upload'

export interface ModelTest {
  id: string
  name: string
  images: UploadedImage[]
  link: string
  correct: boolean
}

export interface ValidationErrors {
  questionContent?: string
  recentResearchLiterature?: string
  certification?: string
  modelTests?: { [key: string]: string }
  correctAnswer?: string
  reviewChecklist?: string
}

export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:'
  } catch (_error) {
    console.error('Invalid URL:', _error)
    return false
  }
}

export const validateQuestionContent = (text: string, images: UploadedImage[]): string | undefined => {
  if (!text.trim() && images.length === 0) {
    return 'Please provide question content (text or an image).'
  }
  if (text.trim().length > 500) {
    return 'Question content must not exceed 500 characters.'
  }
  return undefined
}

export const validateResearchLiterature = (
  hasSource: boolean | undefined,
  url: string | undefined
): string | undefined => {
  if (hasSource === undefined) {
    return 'Please select whether the question is based on recent research literature.'
  }
  if (hasSource && !url?.trim()) {
    return 'Source URL is required when selecting "Yes".'
  }
  if (hasSource && url?.trim() && !isValidUrl(url.trim())) {
    return 'Please provide a valid URL ( https://).'
  }
  return undefined
}

export const validateModelTests = (
  modelTests: ModelTest[]
): { errors: { [key: string]: string }; isValid: boolean } => {
  const modelTestErrors: { [key: string]: string } = {}
  const allUrls: string[] = []
  const allImageHashes: string[] = []

  // Collect all URLs and image hashes for duplicate checking
  modelTests.forEach((model) => {
    const trimmedLink = model.link.trim()
    if (trimmedLink) {
      allUrls.push(trimmedLink)
    }
    model.images.forEach((img) => {
      if (img.hash) {
        allImageHashes.push(img.hash)
      }
    })
  })

  modelTests.forEach((model) => {
    const hasLink = model.link.trim().length > 0
    const hasImages = model.images.length > 0

    if (!hasLink && !hasImages) {
      modelTestErrors[model.id] = 'Please provide a link or upload an image.'
    } else if (hasLink && model.link.trim().length > 120) {
      modelTestErrors[model.id] = 'Link must not exceed 120 characters.'
    } else if (hasLink && !isValidUrl(model.link.trim())) {
      modelTestErrors[model.id] = 'Please provide a valid URL (https://).'
    } else if (hasLink && allUrls.filter((url) => url === model.link.trim()).length > 1) {
      modelTestErrors[model.id] = 'This URL is already used in another model test.'
    } else if (hasImages) {
      const duplicateHash = model.images.find(
        (img) => img.hash && allImageHashes.filter((hash) => hash === img.hash).length > 1
      )
      if (duplicateHash) {
        modelTestErrors[model.id] = 'This image is already used in another model test.'
      }
    }
  })

  return {
    errors: modelTestErrors,
    isValid: Object.keys(modelTestErrors).length === 0
  }
}

export const checkDuplicateInRealTime = (
  modelId: string,
  modelTests: ModelTest[],
  link?: string,
  images?: UploadedImage[]
): string | undefined => {
  const currentModels = modelTests.map((model) => {
    if (model.id === modelId) {
      return {
        ...model,
        images: images !== undefined ? images : model.images,
        link: link !== undefined ? link : model.link
      }
    }
    return model
  })

  // Check for duplicate URLs
  if (link !== undefined && link.trim()) {
    const trimmedLink = link.trim()
    const duplicateUrl = currentModels.some((model) => model.id !== modelId && model.link.trim() === trimmedLink)

    if (duplicateUrl) {
      return 'This URL is already used in another model test.'
    }
  }

  // Check for duplicate images
  if (images !== undefined && images.length > 0) {
    const allImageHashes: string[] = []
    currentModels.forEach((model) => {
      model.images.forEach((img) => {
        if (img.hash) allImageHashes.push(img.hash)
      })
    })

    const duplicateHash = images.find(
      (img) => img.hash && allImageHashes.filter((hash) => hash === img.hash).length > 1
    )

    if (duplicateHash) {
      return 'This image is already used in another model test.'
    }
  }

  return undefined
}

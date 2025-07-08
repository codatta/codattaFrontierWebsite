export type ModelInfo = {
  modelA: {
    name: string
    'fine-tuning'?: string
  }
  modelB: {
    name: string
    'fine-tuning'?: string
  }
}

export type FoodFormItem = {
  modelA: string
  modelB: string
  other: string
}

export type FoodDisplayData = {
  imgUrl: string
  ingredients: string
  cookingMethod: string
  category: string
  estimatedCalories: string
  model: string // for submission
  num: string // for submission
}
export type FoodFormData = {
  imgUrl: string
  ingredients: FoodFormItem
  cookingMethod: FoodFormItem
  category: FoodFormItem
  estimatedCalories: FoodFormItem
}

export type SelectOption = 'modelA' | 'modelB' | 'other' | null

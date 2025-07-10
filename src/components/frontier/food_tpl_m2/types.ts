export type ModelInfo = {
  modelA: {
    displayName: string
    type?: string
  }
  modelB: {
    displayName: string
    type?: string
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
  num: string // for submission
  modelA: {
    name: string
    ingredients: string
    cookingMethod: string
    category: string
    estimatedCalories: string
    fineTuning?: string
  }
  modelB: {
    name: string
    ingredients: string
    cookingMethod: string
    category: string
    estimatedCalories: string
    fineTuning?: string
  }
}

export type SelectOption = 'a_better' | 'b_better' | 'tie' | null

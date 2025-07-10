import { ModelInfo, FoodDisplayData } from './types'

export const w1_mock_data: FoodDisplayData = {
  imgUrl: '/food-example.jpg',
  model: '1',
  num: '1',
  ingredients: 'Ingredients: Salad, Main Course, Main Course.',
  cookingMethod: 'Cooking Method: Boiled, Fry in oil.',
  category: 'Category: Salad, Main Course.',
  estimatedCalories: 'Estimated Calories: 100kcal.'
}

export const w234_mock_model_info: ModelInfo = {
  modelA: {
    displayName: 'GPT-4V',
    type: 'Before Fine-tuning'
  },
  modelB: {
    displayName: 'Gemini 1.5 Pro',
    type: 'After Fine-tuning'
  }
}

export const w234_mock_data = {
  num: '1',
  imgUrl: '/food-example.jpg',
  modelA: {
    name: '1',
    ingredients: 'Lettuce, cherry tomatoes,cucumber, boiled egg,olive oil',
    cookingMethod: 'Raw, ingredients are washed and mixed, egg is boiled',
    category: 'Salad (Vegetable-based)',
    estimatedCalories: '120 kcal (per serving)'
  },
  modelB: {
    name: '2',
    ingredients: 'Lettuce, tomato, cucumber, grilled chicken,feta cheese',
    cookingMethod: 'Grilled chicken, vegetables are fresh and mixed',
    category: 'Salad (With protein)',
    estimatedCalories: '210 kcal (per serving)'
  }
}

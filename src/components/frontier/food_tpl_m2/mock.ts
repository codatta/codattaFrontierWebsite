import { ModelInfo } from './types'

export const w1_mock_data = {
  imgUrl: '/food-example.jpg',
  des: [
    'Ingredients: Salad, Main Course, Main Course.',
    'Cooking Method: Boiled, Fry in oil.',
    'Category: Salad, Main Course.',
    'Estimated Calories: 100kcal.'
  ]
}

export const w234_mock_model_info: ModelInfo = {
  modelA: {
    name: 'GPT-4V',
    'fine-tuning': 'Before Fine-tuning'
  },
  modelB: {
    name: 'Gemini 1.5 Pro',
    'fine-tuning': 'After Fine-tuning'
  }
}

export const w234_mock_data = {
  imgUrl: '/food-example.jpg',
  ingredients: {
    modelA: 'Lettuce, cherry tomatoes,cucumber, boiled egg,olive oil',
    modelB: 'Lettuce, tomato, cucumber, grilled chicken,feta cheese',
    other: "It's a tie"
  },
  cookingMethod: {
    modelA: 'Raw, ingredients are washed and mixed, egg is boiled',
    modelB: 'Grilled chicken, vegetables are fresh and mixed',
    other: "It's a tie"
  },
  category: {
    modelA: 'Salad (Vegetable-based)',
    modelB: 'Salad (With protein)',
    other: "It's a tie"
  },
  estimatedCalories: {
    modelA: '120 kcal (per serving)',
    modelB: '210 kcal (per serving)',
    other: "It's a tie"
  }
}

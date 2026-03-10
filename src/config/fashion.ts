export interface FashionQuestion {
  uid: string
  image_url: string
  source_type: string
}

export interface FashionAnswer extends FashionQuestion {
  is_valid: 'valid' | 'invalid'
  image_type?: 'flat' | 'model' | 'collage' | 'poster'
  category?: 'top' | 'bottom' | 'full' | 'accessory'
  viewpoint?: 'front' | 'back' | 'side'
}

export const QUESTION_OPTIONS = {
  q1: [
    { value: 'valid', label: 'Valid / Clear', description: 'Garment is clearly visible' },
    { value: 'invalid', label: 'Invalid / Trash', description: 'Blurred, blocked or irrelevant to fashion' }
  ],
  q2: [
    { value: 'flat', label: 'Flat / On Hanger', description: 'Single garment flat lay or on a hanger' },
    { value: 'model', label: 'On Model', description: 'Real person model, upper body or fullbody' },
    { value: 'collage', label: 'Collage', description: 'Multi-tile outfits or detail collages' },
    { value: 'poster', label: 'Poster / Design', description: 'Lookbook page, marketing poster or graphic layout' }
  ],
  q3: [
    { value: 'top', label: 'Top', description: 'T-shirt, shirt, hoodie, jacket, etc' },
    { value: 'bottom', label: 'Bottom', description: 'Pants, shorts, skirt, etc.' },
    { value: 'full', label: 'Full Body / Set', description: 'Jumpsuit or coordinated outfit' },
    { value: 'accessory', label: 'Accessory', description: 'Bags, shoes, hats, jewelry, etc.' }
  ],
  q4: [
    { value: 'front', label: 'Front', description: 'Model facing the camera' },
    { value: 'back', label: 'Back', description: 'Back of the model' },
    { value: 'side', label: 'Side', description: 'Side view of the model' }
  ]
}

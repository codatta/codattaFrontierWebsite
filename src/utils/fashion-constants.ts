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

export const FASHION_IMAGES = [
  'https://static.codatta.io/static/images/fashion_validation_1_410769900_18402702937057068_4995874563526129826_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_2_411079960_18075097048434839_835130233022152673_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_3_417470740_18440427763065410_3192119445473450045_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_4_428596726_1707995123057827_2085995735830368048_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_5_435922916_337115022250619_4615706259053921949_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_6_438098057_18276776008205630_6535785023958799737_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_7_438174544_18428643337041950_8580381782852249394_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_8_440414928_2018500101897211_5852865345435641886_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_9_445881358_1711538196320360_7256848884401340635_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_10_447499850_1666528860822368_7725034683433567799_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_11_450926952_1701048727365810_3042576897589188456_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_12_452009012_18446456791057068_1878614669145873278_n.jpg',
  'https://static.codatta.io/static/images/fashion_validation_13_f401008376_1037267577586181_8044207086695707949_n.jpg'
]

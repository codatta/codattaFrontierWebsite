import { selectOptionsMap } from './basic'

export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'

// The inferred type of the entire map, which is now readonly
export type SelectOptionsMap = typeof selectOptionsMap

// The keys of the map, e.g., "country_of_residence" | "most_proficient_language" | ...
export type BasicInfoKey = keyof SelectOptionsMap

// A utility type to extract the possible values from the 'options' array for a given key
export type OptionValue<T extends BasicInfoKey> = SelectOptionsMap[T]['options'][number]['value']

// Dynamically create a type for each set of options
export type CountryOfResidenceValue = OptionValue<'country_of_residence'>
export type MostProficientLanguageValue = OptionValue<'most_proficient_language'>
export type EducationLevelValue = OptionValue<'education_level'>
export type OccupationValue = OptionValue<'occupation'>
export type LargeModelFamiliarityValue = OptionValue<'large_model_familiarity'>
export type CodingAbilityValue = OptionValue<'coding_ability'>
export type BlockchainDomainKnowledgeValue = OptionValue<'blockchain_domain_knowledge'>

export type AnswerKey = 'A' | 'B' | 'C' | 'D' | ''

export interface QuestionOption {
  label: string
  value: AnswerKey
}

export type QuestionKey =
  | 'most_proficient_language'
  | 'education_level'
  | 'occupation'
  | 'large_model_familiarity'
  | 'coding_ability'
  | 'blockchain_domain_knowledge'

export interface QuestionsMap<T> {
  title: string
  defaultKey: T
  list: {
    key: T
    question: string
    rightAnswer: string
    options: {
      label: string
      value: AnswerKey
    }[]
  }[]
}

export interface Question {
  key: QuestionKey
  title: string
  question: string
  rightAnswer: AnswerKey
  options: QuestionOption[]
}

import { SelectOption } from '@/components/mobile-ui/select'

export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export interface SelectOptionsMap {
  [key: string]: {
    title: string
    placeholder: string
    options: SelectOption[]
  }
}

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

export interface Question {
  key: QuestionKey
  question: string
  des: string
  options: QuestionOption[]
}

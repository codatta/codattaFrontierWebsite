export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export interface FormData {
  model: string
  question: string
  ai_wrong_answer: { url: string; hash: string }[]
  your_correct_answer: { url: string; hash: string }[]
}

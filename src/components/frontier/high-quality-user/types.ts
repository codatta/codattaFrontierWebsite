export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export interface FormData {
  question: string
  chatGPT4oImage: { url: string; hash: string }[]
  qwen3Image: { url: string; hash: string }[]
}

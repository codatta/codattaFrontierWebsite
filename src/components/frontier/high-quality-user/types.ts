export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export interface FormData {
  question: string
  chat_gpt_4o: { url: string; hash: string }[]
  qwen_3: { url: string; hash: string }[]
}

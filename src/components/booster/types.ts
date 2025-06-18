export type DataITemIntro = {
  banner?: string
  title?: string
  des: ({ type: 'ul'; content: string[] } | { type: 'p' | 'h4' | 'light'; content: string })[]
}

export type DataItemQuiz = {
  question: string
  answer: {
    des: string
    right?: boolean
  }[]
}

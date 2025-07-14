export type DataITemIntro = {
  banner?: string
  title?: string
  des: (
    | { type: 'ul'; content: (string | React.ReactNode)[] }
    | { type: 'p' | 'h4' | 'light'; content: string | React.ReactNode }
  )[]
}

export type DataItemQuiz = {
  question: string
  answer: QuizAnswer[]
}

export type QuizAnswer = {
  des: string
  right?: boolean
}

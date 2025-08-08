export type AnswerKey = 'A' | 'B' | 'C' | 'D' | ''

export interface Option {
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

const questionsMap: {
  key: QuestionKey
  question: string
  des: string
  options: Option[]
}[] = [
  {
    key: 'most_proficient_language',
    question: 'Most Proficient Language *',
    des: 'You go to a restaurant. What do you say to get food?',
    options: [
      {
        label: 'A. Thank you',
        value: 'A'
      },
      {
        label: 'B. Hello',
        value: 'B'
      },
      {
        label: 'C. I want to order',
        value: 'C'
      },
      {
        label: 'D. I want to order',
        value: 'D'
      }
    ]
  },
  {
    key: 'education_level',
    question: 'Education Level *',
    des: 'Which of the following is generally not considered a chemical reaction?',
    options: [
      {
        label: 'A. lron rusting',
        value: 'A'
      },
      {
        label: 'B. Water freezing',
        value: 'B'
      },
      {
        label: 'C. Paper burning',
        value: 'C'
      },
      {
        label: 'D. Food spoiling',
        value: 'D'
      }
    ]
  },
  {
    key: 'occupation',
    question: 'Occupation *',
    des: 'What does the acronym "GPA" typically stand for?',
    options: [
      {
        label: 'A. Global Product Analysis',
        value: 'A'
      },
      {
        label: 'B.Government Project Approval',
        value: 'B'
      },
      {
        label: 'C. Grade Point Average',
        value: 'C'
      },
      {
        label: 'D. Green Policy Association',
        value: 'D'
      }
    ]
  },
  {
    key: 'large_model_familiarity',
    question: 'Large Model Familiarity *',
    des: 'Which of the following technologies is commonly referred to as a "Large Language Model" (LLM)?',
    options: [
      {
        label: 'A. A calendar app on a mobile phone',
        value: 'A'
      },
      {
        label: "B. A bank's online money transfer system",
        value: 'B'
      },
      {
        label: 'C. An Al program that can understand and generate human language (e.g., ChatGPT)',
        value: 'C'
      },
      {
        label: 'D. A calculator program on a computer',
        value: 'D'
      }
    ]
  },
  {
    key: 'coding_ability',
    question: 'Coding Ability *',
    des: 'Which of the following is a common concept in computer programming used to represent the repeated execution of a task?',
    options: [
      {
        label: 'A. Painting',
        value: 'A'
      },
      {
        label: 'B. Loop',
        value: 'B'
      },
      {
        label: 'C. Writing',
        value: 'C'
      },
      {
        label: 'D. Running',
        value: 'D'
      }
    ]
  },
  {
    key: 'blockchain_domain_knowledge',
    question: 'Blockchain Domain Knowledge *',
    des: 'When you trade on a cryptocurrency exchange, what is your primary focus?',
    options: [
      {
        label: 'A. Writing smart contracts',
        value: 'A'
      },
      {
        label: 'B. Transaction fees and asset price fluctuations',
        value: 'B'
      },
      {
        label: 'C.Verifying the hash of a block',
        value: 'C'
      },
      {
        label: `D. Maintaining a node's consensus mechanism`,
        value: 'D'
      }
    ]
  }
]

export const getQuizQuestions = () => {
  return questionsMap
}

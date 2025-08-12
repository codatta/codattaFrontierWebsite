/* eslint-disable @markof/no-chinese/no-chinese-code */
import {
  MostProficientLanguageValue,
  EducationLevelValue,
  OccupationValue,
  LargeModelFamiliarityValue,
  CodingAbilityValue,
  BlockchainDomainKnowledgeValue,
  QuestionKey,
  QuestionsMap,
  OptionValue,
  AnswerKey
} from './types'

const LanguageQuestionsMap: QuestionsMap<MostProficientLanguageValue> = {
  title: 'Most Proficient Language*',
  defaultKey: 'english',
  list: [
    {
      key: 'english',
      question: 'You go to a restaurant. What do you say to get food?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Thank you', value: 'A' },
        { label: 'B. Hello', value: 'B' },
        { label: 'C. I want to order', value: 'C' },
        { label: 'D. Goodbye', value: 'D' }
      ]
    },
    {
      key: 'chinese',
      question: '你在超市买完东西，收银员会说：',
      rightAnswer: 'B',
      options: [
        { label: 'A. 加油', value: 'A' },
        { label: 'B. 谢谢惠顾', value: 'B' },
        { label: 'C. 跑步开始', value: 'C' },
        { label: 'D. 睡觉时间', value: 'D' }
      ]
    },
    {
      key: 'spanish',
      question: 'Si alguien te dice “¿Cómo estás?”, ¿qué deberías responder?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Gracias', value: 'A' },
        { label: 'B. Buenos días', value: 'B' },
        { label: 'C. Estoy bien', value: 'C' },
        { label: 'D. Hasta luego', value: 'D' }
      ]
    },
    {
      key: 'arabic',
      question: 'ماذا تفعل إذا كنت عطشان؟',
      rightAnswer: 'C',
      options: [
        { label: 'A. أنام', value: 'A' },
        { label: 'B. أكل', value: 'B' },
        { label: 'C. أشرب ماء', value: 'C' },
        { label: 'D. أقرأ كتاباً', value: 'D' }
      ]
    },
    {
      key: 'hindi_urdu',
      question: 'अगर कोई आपसे कहे “नमस्ते”, तो आप क्या कहेंगे?',
      rightAnswer: 'A',
      options: [
        { label: 'A. नमस्ते', value: 'A' },
        { label: 'B. धन्यवाद', value: 'B' },
        { label: 'C. रात का खाना', value: 'C' },
        { label: 'D. चलो चलते हैं', value: 'D' }
      ]
    },
    {
      key: 'french',
      question: 'Quand quelqu’un vous dit “Merci”, vous répondez :',
      rightAnswer: 'B',
      options: [
        { label: 'A. Bonjour', value: 'A' },
        { label: 'B. De rien', value: 'B' },
        { label: 'C. D’accord', value: 'C' },
        { label: 'D. Oui', value: 'D' }
      ]
    },
    {
      key: 'portuguese',
      question: 'Qual dessas bebidas é quente?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Suco', value: 'A' },
        { label: 'B. Café', value: 'B' },
        { label: 'C. Água gelada', value: 'C' },
        { label: 'D. Refrigerante', value: 'D' }
      ]
    },
    {
      key: 'russian',
      question: 'Что вы скажете, когда заходите в магазин?',
      rightAnswer: 'D',
      options: [
        { label: 'A. Пока', value: 'A' },
        { label: 'B. Доброе утро', value: 'B' },
        { label: 'C. Привет', value: 'C' },
        { label: 'D. Здравствуйте', value: 'D' }
      ]
    },
    {
      key: 'japanese',
      question: 'お店で何かを買った後、店員さんはよく何と言いますか？',
      rightAnswer: 'C',
      options: [
        { label: 'A. こんにちは', value: 'A' },
        { label: 'B. おめでとう', value: 'B' },
        { label: 'C. ありがとう', value: 'C' },
        { label: 'D. またね', value: 'D' }
      ]
    },
    {
      key: 'german',
      question: 'Was trinkt man normalerweise am Morgen?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Bier', value: 'A' },
        { label: 'B. Kaffee', value: 'B' },
        { label: 'C. Wein', value: 'C' },
        { label: 'D. Cola', value: 'D' }
      ]
    }
  ]
}

const EducationLevelQuestionsMap: QuestionsMap<EducationLevelValue> = {
  title: 'Education Level*',
  defaultKey: 'high_school_or_below',
  list: [
    {
      key: 'high_school_or_below',
      question: 'Which of the following is generally not considered a chemical reaction?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Iron rusting', value: 'A' },
        { label: 'B. Water freezing', value: 'B' },
        { label: 'C. Paper burning', value: 'C' },
        { label: 'D. Food spoiling', value: 'D' }
      ]
    },
    {
      key: 'associate_or_bachelors',
      question: 'In academic writing, which of the following actions constitutes plagiarism?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Citing the source and author of the original text', value: 'A' },
        { label: 'B. Enclosing the quoted sentences in quotation marks', value: 'B' },
        { label: 'C. Only changing a few words from the original text without citing the source', value: 'C' },
        {
          label: 'D. Paraphrasing the core idea of the original text in your own words and citing the source',
          value: 'D'
        }
      ]
    },
    {
      key: 'masters_degree',
      question: 'In academic research, what do SCI and EI generally refer to?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Two different citation styles for literature', value: 'A' },
        { label: 'B. Two different library classification systems', value: 'B' },
        { label: 'C. Two international core journal databases or indices', value: 'C' },
        { label: 'D. Two names of international academic conference organizations', value: 'D' }
      ]
    },
    {
      key: 'phd_or_above',
      question: 'In academia, what is the core purpose of "Peer Review"?',
      rightAnswer: 'C',
      options: [
        { label: 'A. To ensure the paper receives a large number of likes and shares after publication', value: 'A' },
        { label: 'B. To help the author improve the grammar and formatting of the paper', value: 'B' },
        {
          label: "C. To have experts in the field review the paper's scientific rigor, validity, and originality",
          value: 'C'
        },
        {
          label: 'D. To predict the number of citations and the impact the paper will have after publication',
          value: 'D'
        }
      ]
    }
  ]
}

const OccupationQuestionsMap: QuestionsMap<OccupationValue> = {
  title: 'Occupation*',
  defaultKey: 'blockchain_professional',
  list: [
    {
      key: 'student',
      question: 'What does the acronym "GPA" typically stand for?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Global Product Analysis', value: 'A' },
        { label: 'B. Government Project Approval', value: 'B' },
        { label: 'C. Grade Point Average', value: 'C' },
        { label: 'D. Green Policy Association', value: 'D' }
      ]
    },
    {
      key: 'blockchain_professional',
      question:
        'In the Ethereum network, what is the fee that users have to pay to execute transactions and smart contracts typically called?',
      rightAnswer: 'A',
      options: [
        { label: 'A. Gas Fee', value: 'A' },
        { label: 'B. Commission', value: 'B' },
        { label: 'C. Service Charge', value: 'C' },
        { label: 'D. Token Fee', value: 'D' }
      ]
    },
    {
      key: 'software_tech_professional',
      question: 'In software development, what is the primary function of "Git"?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Remote meetings and video calls', value: 'A' },
        { label: 'B. Code version control and collaborative development', value: 'B' },
        { label: 'C. Database management and data analysis', value: 'C' },
        { label: 'D. Creating product prototypes and user interface design', value: 'D' }
      ]
    },
    {
      key: 'entertainment_industry_worker',
      question:
        'There are significant differences in musical structure between Jazz and Pop music. Which of the following options best reflects a core characteristic of Jazz music?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Strictly follows a pre-written score with no alterations', value: 'A' },
        { label: "B. Is absolutely centered on the singer's vocal timbre and lyrical story", value: 'B' },
        {
          label: 'C. Encourages musicians to perform extensive improvisations over a set chord progression',
          value: 'C'
        },
        { label: 'D. Relies on repetitive, catchy choruses to attract the audience', value: 'D' }
      ]
    },
    {
      key: 'academic_researcher',
      question: 'In academic writing, what is the primary purpose of a "Citation"?',
      rightAnswer: 'C',
      options: [
        { label: 'A. To increase the page count of the paper', value: 'A' },
        { label: 'B. To show the reader that you have read a lot of literature', value: 'B' },
        {
          label: 'C. To acknowledge and attribute existing research and provide theoretical support for it',
          value: 'C'
        },
        { label: 'D. To attract more readers to your paper', value: 'D' }
      ]
    }
  ]
}

const LargeModelFamiliarityQuestionsMap: QuestionsMap<LargeModelFamiliarityValue> = {
  title: 'Large Language Model Familiarity*',
  defaultKey: 'never_used',
  list: [
    {
      key: 'never_used',
      question: 'Which of the following technologies is commonly referred to as a "Large Language Model" (LLM)?',
      rightAnswer: 'C',
      options: [
        { label: 'A. A calendar app on a mobile phone', value: 'A' },
        { label: "B. A bank's online money transfer system", value: 'B' },
        { label: 'C. An AI program that can understand and generate human language (e.g., ChatGPT)', value: 'C' },
        { label: 'D. A calculator program on a computer', value: 'D' }
      ]
    },
    {
      key: 'occasional_user',
      question:
        'When you want a large language model to adopt a specific persona (for example, a professional coding coach), what would you do?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Ask the question directly without mentioning any persona.', value: 'A' },
        { label: 'B. Start your prompt with: "You are now a professional coding coach."', value: 'B' },
        { label: 'C. Use an "If..." statement to describe a hypothetical scenario.', value: 'C' },
        { label: "D. I don't know how to make the model adopt a specific persona.", value: 'D' }
      ]
    },
    {
      key: 'heavy_user',
      question:
        'When a large language model provides false or fabricated information in its response, what is this phenomenon commonly called?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Algorithmic Bias', value: 'A' },
        { label: 'B. Data Staleness', value: 'B' },
        { label: 'C. Hallucination', value: 'C' },
        { label: 'D. Memory Loss', value: 'D' }
      ]
    },
    {
      key: 'expert_level',
      question:
        'When fine-tuning a pre-trained large language model, which of the following methods is generally considered the most effective and resource-efficient?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Completely retraining the model from scratch', value: 'A' },
        { label: 'B. Only adjusting the top output layer of the model', value: 'B' },
        { label: 'C. Using Parameter-Efficient Fine-Tuning (PEFT) techniques, such as LoRA', value: 'C' },
        { label: "D. Increasing the model's parameter count without any training", value: 'D' }
      ]
    }
  ]
}

const CodingAbilityQuestionsMap: QuestionsMap<CodingAbilityValue> = {
  title: 'Coding Ability*',
  defaultKey: 'no_coding_experience',
  list: [
    {
      key: 'no_coding_experience',
      question:
        'Which of the following is a common concept in computer programming used to represent the repeated execution of a task?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Painting', value: 'A' },
        { label: 'B. Loop', value: 'B' },
        { label: 'C. Writing', value: 'C' },
        { label: 'D. Running', value: 'D' }
      ]
    },
    {
      key: 'can_write_simple_scripts',
      question: 'When writing a simple Python script, which keyword do you typically use to define a function?',
      rightAnswer: 'C',
      options: [
        { label: 'A. class', value: 'A' },
        { label: 'B. fun', value: 'B' },
        { label: 'C. def', value: 'C' },
        { label: 'D. import', value: 'D' }
      ]
    },
    {
      key: 'professional_developer',
      question:
        'In a multi-threaded programming scenario, which synchronization mechanism is typically used to prevent multiple threads from modifying shared data simultaneously, which could lead to inconsistent results?',
      rightAnswer: 'C',
      options: [
        { label: 'A. Recursive calls', value: 'A' },
        { label: 'B. Loops', value: 'B' },
        { label: 'C. Mutex (Mutual Exclusion Lock)', value: 'C' },
        { label: 'D. Exception handling', value: 'D' }
      ]
    }
  ]
}

const BlockchainDomainKnowledgeQuestionsMap: QuestionsMap<BlockchainDomainKnowledgeValue> = {
  title: 'Blockchain Domain Knowledge*',
  defaultKey: 'understand_transaction_data',
  list: [
    {
      key: 'have_only_used',
      question: 'When you trade on a cryptocurrency exchange, what is your primary focus?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Writing smart contracts', value: 'A' },
        { label: 'B. Transaction fees and asset price fluctuations', value: 'B' },
        { label: 'C. Verifying the hash of a block', value: 'C' },
        { label: "D. Maintaining a node's consensus mechanism", value: 'D' }
      ]
    },
    {
      key: 'understand_transaction_data',
      question:
        'On an Ethereum blockchain explorer (like Etherscan), which of the following fields best helps you track the unique identity of a transaction?',
      rightAnswer: 'C',
      options: [
        { label: 'A. From Address', value: 'A' },
        { label: 'B. Timestamp', value: 'B' },
        { label: 'C. Transaction Hash', value: 'C' },
        { label: 'D. Block Number', value: 'D' }
      ]
    },
    {
      key: 'some_analytical_skills',
      question:
        'In Decentralized Finance (DeFi), when you deposit crypto assets into a liquidity pool, what form do your earnings typically take?',
      rightAnswer: 'B',
      options: [
        { label: 'A. Stablecoin rewards', value: 'A' },
        { label: 'B. Governance tokens and a share of transaction fees', value: 'B' },
        { label: 'C. NFT collectibles', value: 'C' },
        { label: 'D. Centralized exchange points', value: 'D' }
      ]
    },
    {
      key: 'professional_web3_practitioner',
      question:
        'When developing smart contracts for Ethereum, which of the following programming languages is currently the most commonly used?',
      rightAnswer: 'D',
      options: [
        { label: 'A. JavaScript', value: 'A' },
        { label: 'B. Python', value: 'B' },
        { label: 'C. Rust', value: 'C' },
        { label: 'D. Solidity', value: 'D' }
      ]
    }
  ]
}

const questionsMap: {
  most_proficient_language: QuestionsMap<MostProficientLanguageValue>
  education_level: QuestionsMap<EducationLevelValue>
  occupation: QuestionsMap<OccupationValue>
  large_model_familiarity: QuestionsMap<LargeModelFamiliarityValue>
  coding_ability: QuestionsMap<CodingAbilityValue>
  blockchain_domain_knowledge: QuestionsMap<BlockchainDomainKnowledgeValue>
} = {
  most_proficient_language: LanguageQuestionsMap,
  education_level: EducationLevelQuestionsMap,
  occupation: OccupationQuestionsMap,
  large_model_familiarity: LargeModelFamiliarityQuestionsMap,
  coding_ability: CodingAbilityQuestionsMap,
  blockchain_domain_knowledge: BlockchainDomainKnowledgeQuestionsMap
}

export const getQuestion = (questionKey: QuestionKey, selectedValue: OptionValue<QuestionKey> | undefined) => {
  selectedValue = selectedValue || questionsMap[questionKey].defaultKey
  const question =
    questionsMap[questionKey].list.find((item) => item.key === selectedValue) ||
    questionsMap[questionKey].list.find((item) => item.key === questionsMap[questionKey].defaultKey)

  return {
    key: questionKey,
    title: questionsMap[questionKey].title,
    question: question?.question || '',
    options: question?.options || [],
    rightAnswer: (question?.rightAnswer || '') as AnswerKey
  }
}

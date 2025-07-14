import banner5Img from '@/assets/booster/task-5-quiz.png'

import type { DataItemQuiz, DataITemIntro } from './types'

export type DataItem = {
  intro: DataITemIntro[]
  quiz: DataItemQuiz[]
}

export const Data: DataItem[] = [
  {
    intro: [
      {
        title: 'Technical Features',
        des: [
          {
            type: 'p',
            content:
              'Codatta enhances data quality through AI-powered verification, multi-source data cross-referencing, and a staking-as-confidence mechanism. '
          },
          {
            type: 'p',
            content: 'This enables developers to build machine learning-driven Web3 applications.'
          }
        ]
      },
      {
        title: 'Community & Ecosystem',
        des: [
          {
            type: 'p',
            content:
              'Codatta employs incentive mechanisms like "Annotate to Earn" to encourage user participation in data contribution. '
          },
          {
            type: 'p',
            content: 'The platform has already attracted millions of address annotations from its growing community.'
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'How does Codatta ensure data quality?',
        answer: [
          {
            des: 'A) Relies solely on centralized audits'
          },
          {
            des: 'B) Uses AI verification, multi-source cross-referencing, and staking mechanisms',
            right: true
          },
          {
            des: 'C) Determined entirely by user voting'
          },
          {
            des: 'D) No data verification process'
          }
        ]
      },
      {
        question: 'What does Codatta\'s "Annotate to Earn" system encourage users to do?',
        answer: [
          { des: 'A) Trade cryptocurrencies' },
          { des: 'B) Contribute data', right: true },
          { des: 'C) Develop smart contracts' },
          { des: 'D) Engage in social networking' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Unique Value of Decentralized Data Marketplace',
        des: [
          {
            type: 'p',
            content:
              'Codatta establishes an open data collaboration network where contributors, validators, and users can participate equitably and earn incentives.'
          },
          {
            type: 'p',
            content:
              'Blockchain technology ensures data traceability, immutability, while safeguarding contributor privacy and rights.'
          }
        ]
      },
      {
        title: 'Innovative Model for Web3 Data Economy',
        des: [
          {
            type: 'p',
            content: 'Users monetize data contributions through token rewards, enabling true data assetization.'
          },
          {
            type: 'p',
            content:
              'Developers gain streamlined access to verified datasets, accelerating AI-powered Web3 application development.'
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'What kind of data network does Codatta build?',
        answer: [
          {
            des: 'A) A completely centralized data management system'
          },
          {
            des: 'B) An open, verifiable, and privacy-preserving decentralized network',
            right: true
          },
          {
            des: 'C) Exclusive to specific organizations only'
          },
          {
            des: 'D) No data verification mechanism provided'
          }
        ]
      },
      {
        question: 'What can users gain in the Codatta ecosystem?',
        answer: [
          { des: 'A) Earn token rewards by contributing data', right: true },
          { des: 'B) Only view data without participation rights' },
          { des: 'C) Must purchase expensive data licenses' },
          { des: 'D) No substantive participation methods' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Innovative "Annotate-to-Mine" Model',
        des: [
          {
            type: 'p',
            content:
              'Codatta pioneers Labeling-as-a-Service (LaaS), transforming data annotation tasks into verifiable on-chain proof-of-work'
          },
          {
            type: 'p',
            content:
              'Implements a dual-layer verification system: AI pre-screening + expert review, ensuring quality while maintaining efficiency'
          }
        ]
      },
      {
        title: '',
        des: [
          {
            type: 'p',
            content: 'Dynamically adjusts reward coefficients based on:'
          },
          {
            type: 'ul',
            content: ['Task difficulty', 'Annotation quality', 'Market demand']
          },
          {
            type: 'p',
            content:
              'Features an "Annotation Reputation Score" system, where high-quality annotators receive greater weighting and bonus rewards'
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'How does Codatta ensure data annotation quality?',
        answer: [
          {
            des: 'A) Relies solely on AI auto-labeling'
          },
          {
            des: 'B) Manual random sampling of partial datasets'
          },
          {
            des: 'C) Dual-layer verification with AI pre-screening + expert review',
            right: true
          },
          {
            des: 'D) No quality control measures'
          }
        ]
      },
      {
        question: 'How are annotation rewards determined in Codatta?',
        answer: [
          {
            des: 'A) Fixed-amount rewards'
          },
          {
            des: 'B) Dynamically adjusted based on task difficulty, quality, etc.',
            right: true
          },
          { des: 'C) Only rewards the first completer' },
          { des: 'D) Random reward distribution' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Crypto Data Frontier Use Case',
        des: [
          {
            type: 'p',
            content: 'Core Application Scenarios of our Crypto Data Frontier include:'
          },
          {
            type: 'ul',
            content: ['AML compliance screening', 'On-chain trend analysis', 'Market data monitoring']
          }
        ]
      },
      {
        title: 'Robotics Frontier Use Case',
        des: [
          {
            type: 'p',
            content: 'Core Application Scenarios of our Robotics Frontier include:'
          },
          {
            type: 'ul',
            content: [
              'Object Detection and Recognition',
              'Scene Understanding for Navigation',
              'Activity Recognition and Human-Robot Interaction'
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'Which of the following is NOT a primary application scenario of crypto data frontier?',
        answer: [
          { des: 'A) AML compliance screening' },
          { des: 'B) On-chain trend analysis' },
          { des: 'C) Cryptocurrency mining', right: true },
          { des: 'D) Market data monitoring' }
        ]
      },
      {
        question: 'Which of the following is a primary application scenario of robotics data frontier?',
        answer: [
          { des: 'A) Weather Forecasting' },
          { des: 'B) Object Detection and Recognition', right: true },
          { des: 'C) Social Media Sentiment Analysis' },
          { des: 'D) Financial Market Prediction' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Robotics Data Annotation',
        banner: banner5Img,
        des: [
          {
            type: 'p',
            content:
              'Robotics data annotation is the process of labeling raw data to teach robots how to understand and interact with the real world. This data is used to train machine learning algorithms and improve robot performance. Accurate data annotation is crucial for tasks like object detection, navigation, and manipulation.'
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'What is the purpose of robotics data annotation?',
        answer: [
          { des: 'A) To improve internet speed' },
          { des: 'B) To train machine learning algorithms', right: true },
          { des: 'C) To design robot hardware' },
          { des: 'D) To write robot programming code' }
        ]
      },
      {
        question: 'Which of the following tasks can robotics data annotation help improve?',
        answer: [
          { des: 'A) Time tracking' },
          { des: 'B) Robot navigation and object recognition', right: true },
          { des: 'C) Employee payroll' },
          { des: 'D) Customer support' }
        ]
      }
    ]
  }
]

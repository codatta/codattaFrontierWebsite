export type DataItem = {
  intro: {
    title: string
    des: (string | string[])[]
  }[]
  quiz: {
    question: string
    answer: {
      des: string
      right?: boolean
    }[]
  }[]
}

export const Data: DataItem[] = [
  {
    intro: [
      {
        title: 'Technical Features',
        des: [
          'Codatta enhances data quality through AI-powered verification, multi-source data cross-referencing, and a staking-as-confidence mechanism. ',
          'This enables developers to build machine learning-driven Web3 applications.'
        ]
      },
      {
        title: 'Community & Ecosystem',
        des: [
          'Codatta employs incentive mechanisms like "Annotate to Earn" to encourage user participation in data contribution. ',
          'The platform has already attracted millions of address annotations from its growing community.'
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
          'Codatta establishes an open data collaboration network where contributors, validators, and users can participate equitably and earn incentives.',
          'Blockchain technology ensures data traceability, immutability, while safeguarding contributor privacy and rights.'
        ]
      },
      {
        title: 'Innovative Model for Web3 Data Economy',
        des: [
          'Users monetize data contributions through token rewards, enabling true data assetization.',
          'Developers gain streamlined access to verified datasets, accelerating AI-powered Web3 application development.'
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
          'Codatta pioneers Labeling-as-a-Service (LaaS), transforming data annotation tasks into verifiable on-chain proof-of-work',
          'Implements a dual-layer verification system: AI pre-screening + expert review, ensuring quality while maintaining efficiency'
        ]
      },
      {
        title: '',
        des: [
          'Dynamically adjusts reward coefficients based on:',
          ['Task difficulty', 'Annotation quality', 'Market demand'],
          'Features an "Annotation Reputation Score" system, where high-quality annotators receive greater weighting and bonus rewards'
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
          'Core Application Scenarios of our Crypto Data Frontier include:',
          ['AML compliance screening', 'On-chain trend analysis', 'Market data monitoring']
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
        question: 'What does "FaaS" mean in Codatta?',
        answer: [
          { des: 'A) Function-as-a-Service' },
          { des: 'B) Frontier-as-a-Service', right: true },
          { des: 'C) Framework-as-a-Service' },
          { des: 'D) Firmware-as-a-Service' }
        ]
      }
    ]
  }
]

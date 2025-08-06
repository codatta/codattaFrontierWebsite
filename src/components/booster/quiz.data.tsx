import banner5Img from '@/assets/booster/task-5-quiz.png'
import banner6Img from '@/assets/booster/task-6-quiz.png'

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
  },
  {
    intro: [
      {
        title: 'Crypto Data Annotation',
        banner: banner6Img,
        des: [
          {
            type: 'p',
            content:
              'Crypto Data Annotation is designed to enhance the accuracy and quality of blockchain data. By leveraging community contributions, Codatta enables users to annotate crypto transactions, addresses, and other relevant data, helping to improve data labeling for compliance, analysis, and AI models. ​'
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'What is the main goal of Crypto Data Annotation?',
        answer: [
          { des: 'A) To increase the speed of blockchain transactions​' },
          { des: 'B) To enhance the accuracy and quality of blockchain data​', right: true },
          { des: 'C) To store blockchain data​' },
          { des: 'D) To develop new blockchain networks' }
        ]
      },
      {
        question: 'How does Codatta improve crypto data annotation?',
        answer: [
          { des: 'A) By using automated bots​' },
          { des: 'B) By leveraging community contributions to annotate transactions and addresses​', right: true },
          { des: 'C) By storing data in centralized databases​' },
          { des: 'D) By using AI to generate blockchain transactions' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Key Factors Impacting AML Risk (1)',
        des: [
          {
            type: 'h4',
            content: 'Regulated Financial Institutions:'
          },
          {
            type: 'light',
            content:
              'Banks (like JP Morgan Chase) are highly regulated and follow strict KYC (Know Your Customer) procedures. This means they must verify the identity of their customers, making it difficult for illicit actors to use these platforms for money laundering.'
          },
          {
            type: 'h4',
            content: 'Cryptocurrency Exchanges:'
          },
          {
            type: 'light',
            content:
              'Centralized exchanges (such as Binance) are businesses that provide a platform for trading crypto. Most of these exchanges are regulated and have AML and KYC measures in place. However, the level of compliance can vary between exchanges.'
          }
        ]
      },
      {
        title: 'Key Factors Impacting AML Risk (2)',
        des: [
          {
            type: 'h4',
            content: 'Decentralized Exchanges (DEXs)'
          },
          {
            type: 'light',
            content:
              'DEXs like Uniswap operate without a central authority and typically do not require KYC. While they offer more privacy, this lack of regulation makes them more vulnerable to misuse for money laundering or other illicit activities.'
          },
          {
            type: 'h4',
            content: 'Coin Mixers (Tumblers):'
          },
          {
            type: 'light',
            content:
              "Coin mixers are services that blend different users' cryptocurrencies together, effectively hiding the trail of where the funds came from. This is considered a high-risk behavior from an AML perspective, as it makes it much harder to trace the origin and destination of funds."
          },
          {
            type: 'h4',
            content: 'Cryptocurrency Wallets:'
          },
          {
            type: 'light',
            content:
              'Wallets (both hot and cold) are used to store cryptocurrencies. While wallets themselves are neutral tools, the way in which they are used in transactions can impact the overall AML risk, especially if linked with unregulated platforms or coin mixers.'
          }
        ]
      }
    ],
    quiz: [
      {
        question: (
          <div className="text-left">
            You are assessing AML (Anti-Money Laundering) risk for different crypto transaction paths. Rank the
            following paths from safest to riskiest:
            <p className="mt-3 text-base font-normal">Path A: JP Morgan Chase → Binance → Withdrawal</p>
            <p className="text-base font-normal">Path B: JP Morgan Chase → Binance → Uniswap (DEX) → Wallet</p>
            <p className="text-base font-normal">
              Path C: JP Morgan Chase → Binance → Coin Mixer → Wallet Which ranking is correct?
            </p>
          </div>
        ),
        answer: [
          { des: 'A) Path A → Path B → Path C', right: true },
          { des: 'B) Path B → Path A → Path C' },
          { des: 'C) Path C → Path B → Path A' },
          { des: 'D) Path A → Path C → Path B' }
        ]
      },
      {
        question: (
          <div className="text-left">
            Which of the following is a common red flag for potential money laundering in cryptocurrency transactions?
          </div>
        ),
        answer: [
          { des: 'A) Small, frequent transactions to known wallets', right: true },
          { des: 'B) Large transactions to wallets with no prior transaction history' },
          { des: 'C) Transactions involving stablecoins pegged to fiat currencies' },
          { des: 'D) Transactions occurring during regular business hours' }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Factors Increasing AML Risk',
        des: [
          {
            type: 'h4',
            content: 'High-Frequency Trading (B):'
          },
          {
            type: 'light',
            content: 'Rapid trades can be used to obscure funds, but data transparency helps track such activity.'
          },
          {
            type: 'h4',
            content: 'Transparent Blockchain Transactions (C):'
          },
          {
            type: 'light',
            content: 'Transparency actually reduces AML risk by allowing authorities to trace all transactions.'
          },
          {
            type: 'h4',
            content: 'Hardware Wallet Transactions (D): '
          },
          {
            type: 'light',
            content: 'While secure, these transactions still need monitoring through transparent on-chain data.'
          }
        ]
      },
      {
        title: 'AML Controls in Centralized Exchanges',
        des: [
          {
            type: 'p',
            content: 'Centralized exchanges face high AML risks and must implement the following measures:'
          },
          {
            type: 'light',
            content: (
              <>
                <span className="text-lg font-bold text-white">KYC Verification:</span> Ensures users' identities are
                confirmed to prevent illegal activity.
              </>
            )
          },
          {
            type: 'light',
            content: (
              <>
                <span className="text-lg font-bold text-white">Transaction Monitoring:</span> Identifies suspicious
                transactions, such as rapid or large trades.
              </>
            )
          },
          {
            type: 'light',
            content: (
              <>
                <span className="text-lg font-bold text-white">Reporting Large Transactions:</span> Exchanges report
                transactions above a certain threshold to regulators.
              </>
            )
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'Which of the following factors increases the AML risk of a cryptocurrency transaction?',
        answer: [
          { des: 'A) The transaction involves a well-known, regulated exchange' },
          { des: 'B) The transaction is part of a series of rapid, high-frequency trades', right: true },
          { des: 'C) The transaction is transparent and recorded on a public blockchain' },
          { des: 'D) The transaction is initiated from a hardware wallet' }
        ]
      },
      {
        question:
          'Which of the following is NOT a typical AML control implemented by centralized cryptocurrency exchanges?',
        answer: [
          { des: 'A) Know Your Customer (KYC) verification' },
          { des: 'B) Transaction monitoring for suspicious activity' },
          { des: 'C) Mandatory use of multi-signature wallets', right: true },
          { des: 'D) Reporting large transactions to regulators' }
        ]
      }
    ]
  }
]

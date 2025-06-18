import banner1Img from '@/assets/booster/task-1-ppt-banner.png'
import banner4Img from '@/assets/booster/task-4-ppt-banner.png'

export type DataITemIntro = {
  banner?: string
  title?: string
  des: ({ type: 'ul'; content: string[] } | { type: 'p' | 'h4'; content: string })[]
}
export type DataItem = {
  intro: DataITemIntro[]
}

export const Data: DataItem[] = [
  {
    intro: [
      {
        banner: banner1Img,
        des: [
          {
            type: 'p',
            content:
              'Codatta is an open, decentralized, multi-chain protocol uniting blockchain-based data infrastructure with a collaborative network of human contributors and specialized AI agents. '
          },
          {
            type: 'p',
            content:
              'Contributors and knowledge backers gain the opportunity to earn perpetual royalties from AI innovations powered by datasets they collectively own, transforming individual knowledge into lasting digital assets and ongoing rewards.'
          }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'The Problem with Current AI Data Systems',
        des: [
          {
            type: 'p',
            content:
              'The current AI revolution lacks equitable data compensation mechanisms, where knowledge contributors are significantly undervalued, and centralized systems further hinder innovation.'
          }
        ]
      },
      {
        title: "Codatta's Decentralized Solutions",
        des: [
          {
            type: 'p',
            content: 'Codatta addresses these challenges through blockchain-powered decentralized solutions:'
          },
          {
            type: 'ul',
            content: [
              'Creating Tradable Knowledge Assets with transparent provenance',
              'Ensuring Fair Compensation for Experts through smart contracts',
              'Breaking Data Monopolies via community-driven collaboration'
            ]
          }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: "Codatta's Multi-Chain Architecture",
        des: [
          {
            type: 'p',
            content: 'Codatta is a multi-chain decentralized AI data protocol comprising three core modules:'
          },
          { type: 'h4', content: '1. Data Production Layer' },
          { type: 'h4', content: '2. Privacy Verification Layer' },
          { type: 'h4', content: '3. Data Assetization Layer' },
          {
            type: 'p',
            content:
              'The architecture establishes an end-to-end on-chain ecosystem-from data collection to royalty distribution-powered by DID identity systems and a Proof-of-Quality (PoQ) consensus mechanism.'
          }
        ]
      }
    ]
  },
  {
    intro: [
      {
        banner: banner4Img,
        des: [
          { type: 'h4', content: 'Phase 1 - Completed' },
          { type: 'p', content: 'Validated genuine market demand and technical feasibility' },
          { type: 'h4', content: 'Phase 2 - Completed' },
          { type: 'p', content: 'Established the Frontier model based on Phase 1 foundations' },
          {
            type: 'p',
            content: 'Launched multiple Frontier products with stable long-term operation and recurring revenue'
          },
          { type: 'h4', content: 'Current Phase 3 - In Progress' },
          { type: 'p', content: 'FaaS (Frontier-as-a-Service): Completed prototype and initial development phase' }
        ]
      }
    ]
  }
]

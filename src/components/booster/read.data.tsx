import type { DataITemIntro } from './types'

import banner1Img from '@/assets/booster/task-1-read-banner.png'
import banner4Img from '@/assets/booster/task-4-read-banner.png'
import banner5Img from '@/assets/booster/task-5-read-banner.png'
import banner51Img from '@/assets/booster/task-5-2-read-banner.png'

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
              'Codatta is an open, decentralized, multi-chain protocol uniting blockchain-based data infrastructure with a collaborative network of human contributors and specialized AI agents.  '
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
        title: 'Codatta Roadmap',
        banner: banner4Img,
        des: [
          { type: 'h4', content: 'Phase 1 - Completed' },
          { type: 'light', content: 'Validated genuine market demand and technical feasibility' },
          { type: 'h4', content: 'Phase 2 - Completed' },
          { type: 'light', content: 'Established the Frontier model based on Phase 1 foundations' },
          {
            type: 'light',
            content: 'Launched multiple Frontier products with stable long-term operation and recurring revenue'
          },
          { type: 'h4', content: 'Current Phase 3 - In Progress' },
          { type: 'light', content: 'FaaS (Frontier-as-a-Service): Completed prototype and initial development phase' }
        ]
      },
      {
        title: `Codatta's Data Frontiers`,
        des: [
          {
            type: 'p',
            content:
              'Codatta categorizes the "data frontiers" based on their difficulty and the level of expertise required from contributors.'
          },
          {
            type: 'p',
            content: (
              <>
                Codatta's current frontiers include:{' '}
                <span className="font-semibold">
                  Food Science, Crypto, Robotics, Fashion, Healthcare, Video Evaluation, Outfit of the Day (OOTD) and
                  Speech
                </span>
                , allowing the platform to meet diverse data demands that range from foundational data to highly
                specialized knowledge required for vertical AI solutions.
              </>
            )
          }
        ]
      }
    ]
  },
  {
    intro: [
      {
        title: 'Data Frontier',
        banner: banner5Img,
        des: [
          {
            type: 'p',
            content: `Codatta's "Data Frontier" concept is central to its mission of acquiring valuable, specialized knowledge
                and data at scale to advance AI, particularly in vertical (specialized) fields.`
          },
          {
            type: 'p',
            content: `Codatta addresses these challenges through "Frontier as a Service (FaaS)", utilizing Web3.0 to transform human knowledge into "Knowledge Data Assets".`
          }
        ]
      },
      {
        title: 'Robotics Frontier',
        banner: banner51Img,
        des: [
          {
            type: 'p',
            content: `For fields like robotics, this means obtaining essential visual data annotation from experts to train large AI models for object recognition and spatial awareness.`
          },
          {
            type: 'p',
            content: `Our royalty-based payment mechanism ensures that as AI grows from using this specialized data, human experts earn long-term rewards.`
          }
        ]
      }
    ]
  }
]

import JourneyCornerImage from '@/assets/journey/card-corner.svg'
import JourneyQuestLevelImage from '@/assets/journey/level-icon.png'
import { Button } from 'antd'

interface JourneyQuestItem {
  id: number
  title: string
  description: string
  status: 'completed' | 'claimable' | 'future'
}

function JourneyQuestCard({ item }: { item: JourneyQuestItem }) {
  return (
    <div className="relative w-full">
      <div className="w-full rounded-2xl border border-[#3C3C46] bg-[#252532] px-6 pb-8 pt-3">
        <img src={JourneyCornerImage} alt="" className="absolute left-0 top-0" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-end">
          <div className="shrink-0 basis-[100px]">
            <img src={JourneyQuestLevelImage} alt="" className="relative mb-1 block w-[100px]" />
            <p className="text-center text-sm font-bold">Level up</p>
          </div>
          <div className="flex-1">
            <h2 className="mb-3 line-clamp-2 text-base font-bold">{item.title}</h2>
            <p className="line-clamp-2 text-sm font-normal text-white/40">{item.description}</p>
          </div>
          <div className="shrink-0 basis-auto lg:basis-[240px]">
            <Button block className="h-[40px]" shape="round" type="primary">
              Go to Quest
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JourneyQuest() {
  const cards = [
    {
      id: 1,
      title: 'Start your codatta journey: How to perform validation.',
      description: 'Complete the quests in this module to enhance understanding of validation.',
      status: 'completed' as const
    },
    {
      id: 2,
      title: 'Bind your social media account to improve your reputation',
      description:
        'By linking your social media account, you can strengthen your connection with codatta, improve your reputation, and complete quests related to social media.',
      status: 'claimable' as const
    },
    {
      id: 3,
      title: 'Complete Cyclic quests to receive substantial daily rewards.',
      description:
        "The main goal of Cyclic quests is to help users become familiar with the crypto frontier. As data contributors, we don't want to impose any extra burden on you. Instead, we periodically encourage you to engage in core data activities, such as submission and validation.",
      status: 'future' as const
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      {cards.map((item) => (
        <JourneyQuestCard key={item.id} item={item} />
      ))}
    </div>
  )
}

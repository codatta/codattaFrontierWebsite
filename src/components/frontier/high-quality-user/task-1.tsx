import { Button } from 'antd'

export default function Task1({ onJoinedTelegram }: { onJoinedTelegram: () => void }) {
  const handleJoinTelegram = () => {
    // onJoinedTelegram()
  }
  return (
    <>
      <h2 className="mt-4 text-center text-2xl font-bold md:mt-6">
        Your Gateway to <br />
        Premium Annotation Tasks and Rewards
      </h2>
      <div className="mt-4 rounded-xl bg-[#252532] p-4 text-lg text-[#BBBBBE] md:mt-6 md:border md:border-[#FFFFFF1F]">
        <p>The journey to becoming a High-Value Annotator begins here.</p>
        <p className="mt-2">
          Exclusive, higher-reward projects for your professional skills are announced first in this telegram community.
        </p>
      </div>
      <Button
        type="primary"
        className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
        onClick={handleJoinTelegram}
      >
        Join Now
      </Button>
    </>
  )
}

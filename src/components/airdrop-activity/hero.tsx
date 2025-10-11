import { CalendarDays, Loader2, BookText } from 'lucide-react'
import HeroBgImage from '@/assets/airdrop-activity/hero-bg.webp'
import { Link } from 'react-router'
import { useAirdropActivityStore } from '@/stores/airdrop-activity.store'

export default function AirdropActivityHero() {
  const { currentAirdropInfo } = useAirdropActivityStore()

  function formatDate(date: string) {
    if (!date) return ''
    const fixed = date.replace(/(\+\d{2}:\d{2})\.\d+Z$/, '$1')
    return new Date(fixed).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <section
      style={{ backgroundImage: `url(${HeroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="overflow-hidden rounded-2xl"
    >
      {!currentAirdropInfo ? (
        <div className="flex h-[212px] items-center justify-center bg-black/20">
          <Loader2 className="animate-spin"></Loader2>
        </div>
      ) : (
        <div className="relative p-5 md:px-10 md:py-8">
          <div className="grid grid-cols-1 items-end gap-6">
            {/* Left content */}
            <div className="flex flex-col justify-between">
              <div>
                {/* pill */}
                <div className="flex items-center">
                  <div className="mb-2 inline-flex items-center whitespace-nowrap rounded-full bg-gradient-to-b from-[#FFE37E] to-[#FFCF4E] px-5 py-2 text-sm font-semibold text-[#1E1E2A] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.08)]">
                    {currentAirdropInfo?.title}
                  </div>
                  {currentAirdropInfo?.rules_link && (
                    <a
                      href={currentAirdropInfo?.rules_link}
                      className="ml-auto flex items-center gap-2 rounded-full border px-4 py-2"
                      target="_blank"
                    >
                      <BookText size={14}></BookText>
                      Rules
                    </a>
                  )}
                </div>

                <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white md:text-[32px]">
                  {currentAirdropInfo?.name}
                </h1>

                <p className="mb-3 text-sm text-white/70 md:text-sm">{currentAirdropInfo?.description}</p>
              </div>

              {/* date */}
              <div className="flex items-center gap-2 text-base text-white/80">
                <CalendarDays className="size-5 text-white/90" />
                <span className="text-base md:text-lg">
                  {formatDate(currentAirdropInfo?.start_time || '')} - {formatDate(currentAirdropInfo?.end_time || '')}
                </span>
              </div>
            </div>

            {/* Right metrics panel */}
            <div className="mb-1 flex flex-col rounded-2xl bg-black/30 transition-all hover:bg-black/0">
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {/* Total Rewards */}
                <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                  <p className="text-sm font-medium text-white/70">Total Rewards</p>
                  <p className="text-3xl font-extrabold text-[#FFDF37] md:text-2xl">
                    {currentAirdropInfo?.total_rewards[0].reward_amount}
                  </p>
                  <p className="text-xs text-white/80"> {currentAirdropInfo?.total_rewards[0].reward_type}</p>
                </div>

                {/* Points Reward */}
                <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                  <p className="text-sm font-medium text-white/70">Points Reward</p>
                  <p className="text-3xl font-extrabold text-white md:text-2xl">
                    {currentAirdropInfo?.total_point_reward}
                  </p>
                  <p className="text-xs text-white/80">POINTS</p>
                </div>

                {/* Participants */}
                <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                  <p className="text-sm font-medium text-white/70">Participants</p>
                  <p className="text-3xl font-extrabold text-white md:text-2xl">{currentAirdropInfo?.participants}</p>
                  <p className="text-xs text-white/80">All Experts Joined</p>
                </div>

                {/* Leaderboard */}
                <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                  <p className="text-sm font-medium text-white/70">Leaderboard</p>

                  <Link
                    to="/app/airdrop/leaderboard"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-[#8A6BFF] px-1 py-2 text-sm font-semibold text-white transition hover:bg-[#7b5bf5]"
                  >
                    View Rankings
                  </Link>
                  <p className="text-xs text-white/80">Current Season</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

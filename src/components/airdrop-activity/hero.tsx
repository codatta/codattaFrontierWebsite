import { CalendarDays, ArrowRight } from 'lucide-react'
import HeroBgImage from '@/assets/airdrop-activity/hero-bg.webp'

export default function AirdropActivityHero() {
  return (
    <section
      style={{ backgroundImage: `url(${HeroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="rounded-2xl"
    >
      <div className="relative p-5 md:px-10 md:py-8">
        <div className="grid grid-cols-1 items-end gap-6 2xl:grid-cols-[1fr,720px]">
          {/* Left content */}
          <div className="flex flex-col justify-between">
            <div>
              {/* pill */}
              <div className="inline-flex items-center rounded-full bg-gradient-to-b from-[#FFE37E] to-[#FFCF4E] px-5 py-2 text-sm font-semibold text-[#1E1E2A] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.08)]">
                AI Recruitment Drive
              </div>

              <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white md:text-[32px]">
                AI EXPERTS WANTED
              </h1>

              <p className="mb-3 line-clamp-2 max-w-xl text-sm text-white/70 md:text-sm">
                Descriptive copy descriptive copy descriptive copy descriptive copy descriptive copy descriptive copy
                lasjdfklajs asdlkfj asdlfkjas lkdfj klasdjf lasj dflkj
              </p>
            </div>

            {/* date */}
            <div className="flex items-center gap-2 text-base text-white/80">
              <CalendarDays className="size-5 text-white/90" />
              <span className="text-base md:text-lg">September 1, 2025 - October 10, 2025</span>
            </div>
          </div>

          {/* Right metrics panel */}
          <div className="mb-1 flex flex-col rounded-2xl bg-black/30 transition-all hover:bg-black/0">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {/* Total Rewards */}
              <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                <p className="text-sm font-medium text-white/70">Total Rewards</p>
                <p className="text-3xl font-extrabold text-[#FFDF37] md:text-2xl">12,061</p>
                <p className="text-xs text-white/80">XnY</p>
              </div>

              {/* Participants */}
              <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                <p className="text-sm font-medium text-white/70">Participants</p>
                <p className="text-3xl font-extrabold text-white md:text-2xl">12,061</p>
                <p className="text-xs text-white/80">All Experts Joined</p>
              </div>

              {/* Top 10 Reward */}
              <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                <p className="text-sm font-medium text-white/70">Top 10 Reward</p>
                <p className="text-3xl font-extrabold text-white md:text-2xl">12,061</p>
                <p className="text-xs text-white/80">USDT</p>
              </div>

              {/* Leaderboard */}
              <div className="flex flex-col gap-0.5 rounded-xl bg-white/0 p-[18px] text-center transition-none hover:bg-black/70">
                <p className="text-sm font-medium text-white/70">Leaderboard</p>

                <button className="inline-flex h-8 items-center justify-center rounded-full bg-[#8A6BFF] px-1 py-2 text-sm font-semibold text-white transition hover:bg-[#7b5bf5]">
                  View Rankings
                </button>
                <p className="text-xs text-white/80">Current Season</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

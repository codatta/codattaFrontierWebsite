import { ArrowLeft, RefreshCw } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'

import pluginStartImage from '@/assets/frontier/fashion/plugin-start.png'
import pluginStopImage from '@/assets/frontier/fashion/plugin-stop.png'

export default function FashionGuideToDownload() {
  const onBack = () => {
    window.history.back()
  }

  const goDownload = () => {
    window.open(
      'https://chromewebstore.google.com/detail/codatta-clip/doklnekkemmhclakfekoccilofpdcncb?hl=zh-CN&utm_source=ext_sidebar',
      '_blank'
    )
  }

  return (
    <AuthChecker>
      <div className="min-h-screen bg-[#15151e] font-inter text-white">
        {/* Header */}
        <div className="border-b border-[#FFFFFF1F] bg-[#15151e] py-6">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-[#FFFFFF99] transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <h1 className="text-base font-bold">Collect Fashion Data from Codatta Clip</h1>
            <div className="w-[60px]"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-12">
          {/* Left Column - Hero Image */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 overflow-hidden rounded-2xl bg-[#252532]">
              {/* Placeholder for the fashion group image */}
              <div className="aspect-[4/3] w-full bg-[#252532]">
                <img
                  src="https://static.codatta.io/static/images/fashion-example_1769071191609.png"
                  alt="Fashion Group"
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement?.classList.add(
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-gray-500'
                    )
                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'Fashion Image'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Step 1: Download */}
              <div className="rounded-2xl border border-[#00000029] bg-[#252532] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#875DFF33] px-3 py-0.5 text-sm font-semibold text-[#875DFF]">
                        Step1
                      </span>
                      <span className="text-base font-bold text-white">Download</span>
                    </div>
                    <p className="mt-3 text-xs text-[#9CA3AF]">Download Codatta Clip plugin</p>
                  </div>
                  <button
                    onClick={goDownload}
                    className="h-12 w-[240px] rounded-full bg-[#875DFF] text-sm text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    GO
                  </button>
                </div>
              </div>

              {/* Step 2: Start */}
              <div className="rounded-2xl border border-[#FFFFFF0A] bg-[#252532] p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#875DFF33] px-3 py-0.5 text-sm font-semibold text-[#875DFF]">
                    Step2
                  </span>
                  <span className="text-base font-bold text-white">Start</span>
                </div>
                <p className="mt-3 text-xs text-[#9CA3AF]">Open Codatta Clip, select Fashion tab and hit Start</p>
              </div>

              {/* Gradient Card with Mockup */}
              <div className="relative flex aspect-[684/468] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF9A9E] via-[#FECFEF] to-[#A18CD1] p-10">
                {/* Foreground image will be added here */}
                <img src={pluginStartImage} alt="Plugin Start" className="max-h-full max-w-full object-cover" />
              </div>

              {/* Step 3: Reward */}
              <div className="rounded-2xl border border-[#FFFFFF0A] bg-[#252532] p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#875DFF33] px-3 py-0.5 text-sm font-semibold text-[#875DFF]">
                    Step3
                  </span>
                  <span className="text-base font-bold text-white">Reward</span>
                </div>
                <p className="mt-3 text-xs text-[#9CA3AF]">
                  Stop collecting—manually or at the daily limit. Rewards auto-distributed.
                </p>
              </div>

              {/* Gradient Card with Mockup */}
              <div className="relative flex aspect-[684/468] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF9A9E] via-[#FECFEF] to-[#A18CD1] p-10">
                {/* Foreground image will be added here */}
                <img src={pluginStopImage} alt="Plugin Stop" className="max-h-full max-w-full object-cover" />
              </div>
            </div>

            {/* Sync Banner */}
            <div className="mt-12 rounded-2xl border border-[#875DFF]/30 bg-[#252532] p-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#875DFF]">
                  <RefreshCw className="size-5 text-white" />
                </div>
                <div>
                  <div className="rounded-full text-sm font-semibold text-white">Data Sync Active</div>
                  <div className="mt-1 text-xs text-[#9CA3AF]">
                    Your history and reward totals are updated daily at <span className="text-white">00:00 UTC</span>{' '}
                    and can be viewed on the web.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthChecker>
  )
}

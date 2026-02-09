import { Eye, Box, Gauge, Sparkles, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import CommercialAccessDrawer from '@/components/dataset/commercial-access-drawer'
import bridge from '@/components/app/bridge'

export default function KitchenApplicants() {
  const [showCommercialDrawer, setShowCommercialDrawer] = useState(false)

  const usageItems = [
    {
      icon: <Eye className="size-full text-black" />,
      title: 'Multi-View Object Recognition'
    },
    {
      icon: <Box className="size-full text-black" />,
      title: '3D Shape Reconstruction'
    },
    {
      icon: <Gauge className="size-full text-black" />,
      title: 'Knob State/Angle Estimation'
    },
    {
      icon: <Sparkles className="size-full text-black" />,
      title: 'Generative AI Training'
    }
  ]

  function onBack() {
    window.history.back()
  }

  function handleDownload() {
    const url = 'https://huggingface.co/datasets/Codatta/Appliance-Knobs'
    if (bridge.isInApp()) {
      bridge.downloadDataset('kitchen-applicants')
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <button
        onClick={onBack}
        className="fixed left-5 top-5 flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] text-black shadow-app-btn backdrop-blur-sm"
      >
        <ChevronLeft size={24}></ChevronLeft>
      </button>

      <img
        src="https://static.codatta.io/dataset/kitchen-applicants.png"
        className="block aspect-[362/240] w-full"
        alt=""
      />

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-5 py-6">
        {/* Title and Description */}
        <div className="mb-9">
          <h1 className="mb-4 text-2xl font-bold text-black">Kitchen Applicants</h1>
          <p className="text-[15px] text-[#999999]">
            This dataset offers high-resolution paired images of appliance knobs and rotary controls, captured from both
            front and side views. Curated by Codatta, it supports fine‑grained object understanding, 3D shape
            estimation, and state recognition tasks.
          </p>
        </div>

        {/* Data Size Metrics */}
        <h2 className="mb-4 text-[17px] font-bold text-black">Key Statistics</h2>

        <div className="mb-9 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Download Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">1.71 </strong>GB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Parquet Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">1.71 </strong>GB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Total Rows</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">408</strong>
            </p>
          </div>
        </div>

        {/* Usage Section */}
        <div className="mb-9">
          <h2 className="mb-4 text-xl font-bold text-black">Usage</h2>
          <div className="grid grid-cols-2 gap-4">
            {usageItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-between rounded-[26px] bg-white/60 p-4 shadow-glass"
              >
                <div
                  className="mb-4 flex size-11 items-center justify-center rounded-full p-[8px]"
                  style={{
                    background: 'linear-gradient(to right, #e6f3fa 30%, #eff6fa10 100%)',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-black">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-6 mb-8 flex gap-4">
          <button
            className="flex-1 rounded-full bg-white/60 py-4 font-medium text-black shadow-glass backdrop-blur-md transition-colors hover:bg-gray-50"
            onClick={() => setShowCommercialDrawer(true)}
          >
            Contact Us
          </button>
          <button
            className="flex-1 rounded-full bg-black py-4 font-medium text-white transition-colors hover:bg-gray-800"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>

      {/* Commercial Access Drawer */}
      <CommercialAccessDrawer open={showCommercialDrawer} onClose={() => setShowCommercialDrawer(false)} />
    </div>
  )
}

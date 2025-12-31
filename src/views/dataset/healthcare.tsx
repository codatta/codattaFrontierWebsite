import { Microscope, Brain, ChevronLeft } from 'lucide-react'
import { Pie, PieChart } from 'recharts'
import { useState } from 'react'
import CommercialAccessDrawer from '@/components/dataset/commercial-access-drawer'

// Chart data
const chartData = [
  { name: "Agree with TCGA's label", value: 190, fill: '#40E1EF' }, // cyan/turquoise
  { name: 'Refined label and ROI', value: 245, fill: '#000000' } // solid black
]

// Donut Chart Component using SVG
const DonutChart = () => {
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="relative mx-auto flex aspect-1 size-full items-center justify-center">
      <PieChart
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '80vh',
          aspectRatio: 1
        }}
        responsive
      >
        <Pie
          data={chartData}
          innerRadius="65%"
          outerRadius="100%"
          cornerRadius="8px"
          paddingAngle={0}
          dataKey="value"
        />
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mt-2 text-2xl font-bold text-black">{total.toLocaleString()}</span>
        <span className="text-sm text-[#999]">Total</span>
      </div>
    </div>
  )
}

// Legend Component
const ChartLegend = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      {chartData.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function Healthcare() {
  const [showCommercialDrawer, setShowCommercialDrawer] = useState(false)

  const usageItems = [
    {
      icon: <Brain className="size-full text-black" />,
      title: 'AI Training Pipelines'
    },
    {
      icon: <Microscope className="size-full text-black" />,
      title: 'Pathology Research'
    }
  ]

  function onBack() {
    window.history.back()
  }

  function handleDownload() {
    const url = 'https://huggingface.co/datasets/Codatta/Refined-TCGA-PRAD-Prostate-Cancer-Pathology-Dataset'
    const isInApp = navigator.userAgent.match(/codatta/i)
    if (isInApp) {
      // TODO:
      // window.native.call('downloadDataset', 'healthcare')
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

      <img src="https://static.codatta.io/dataset/healthcare.png" className="block aspect-[362/240] w-full" alt="" />

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-5 py-6">
        {/* Title and Description */}
        <div className="mb-9">
          <h1 className="mb-4 text-2xl font-bold text-black">Refined TCGA PRAD Prostate Cancer Pathology Dataset</h1>
          <p className="text-[15px] text-[#999999]">
            This dataset provides enhanced Gleason grading annotations for the TCGA PRAD prostate cancer dataset,
            supported by Region of Interest (ROI)-level spatial annotations. This dataset improved accuracies and
            granularity of information in the original TCGA-PRAD slide-level labels.
          </p>
        </div>

        {/* Key Statistics Section */}
        <div className="mb-4">
          <h2 className="mb-4 text-[17px] font-bold text-black">Key Statistics</h2>
          <div className="rounded-[26px] bg-white/50 p-6 shadow-glass">
            <div className="grid grid-cols-2">
              {/* Legend */}
              <ChartLegend />
              {/* Donut Chart */}
              <DonutChart />
            </div>
          </div>
        </div>

        {/* Data Size Metrics */}
        <div className="mb-9 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Download Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">57.2 </strong>kB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Parquet Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">28.4 </strong>kB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Total Rows</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">138</strong>
            </p>
          </div>
        </div>

        {/* Usage Section */}
        <div className="mb-9">
          <h2 className="mb-4 text-xl font-bold text-black">Usage</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start justify-between rounded-[26px] bg-white/60 p-4 shadow-glass">
              <div
                className="mb-4 flex size-11 items-center justify-center rounded-full p-[8px]"
                style={{
                  background: 'linear-gradient(to right, #e6f3fa 30%, #eff6fa10 100%)',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
                }}
              >
                {usageItems[0].icon}
              </div>
              <h3 className="text-[15px] font-semibold text-black">{usageItems[0].title}</h3>
            </div>
            <div className="flex flex-col items-start justify-between rounded-[26px] bg-white/60 p-4 shadow-glass">
              <div
                className="mb-4 flex size-11 items-center justify-center rounded-full p-[8px]"
                style={{
                  background: 'linear-gradient(to right, #e6f3fa 30%, #eff6fa10 100%)',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
                }}
              >
                {usageItems[1].icon}
              </div>
              <h3 className="text-[15px] font-semibold text-black">{usageItems[1].title}</h3>
            </div>
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

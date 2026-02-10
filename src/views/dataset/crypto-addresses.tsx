import { TestTube, Briefcase, ChevronLeft } from 'lucide-react'
import { Pie, PieChart } from 'recharts'
import { useState } from 'react'
import CommercialAccessDrawer from '@/components/dataset/commercial-access-drawer'
import bridge from '@/components/mobile-app/bridge'

// Chart data for Distribution by Chain
const chainData = [
  { name: 'Bitcoin', value: 185800000, fill: '#FF9500' },
  { name: 'Polygon', value: 129300000, fill: '#8B5CF6' },
  { name: 'Ethereum', value: 107400000, fill: '#3B82F6' },
  { name: 'BSC', value: 61000000, fill: '#FBBF24' },
  { name: 'Tron', value: 22100000, fill: '#EF4444' },
  { name: 'Others', value: 11200000, fill: '#D1D5DB' }
]

// Chart data for Distribution by Category
const categoryData = [
  { name: 'Smart Contract', value: 235000000, fill: '#1E40AF' },
  { name: 'Exchange', value: 187700000, fill: '#06B6D4' },
  { name: 'Scam', value: 24300000, fill: '#EF4444' },
  { name: 'Gambling', value: 18000000, fill: '#FBBF24' },
  { name: 'Ransom', value: 1000000, fill: '#10B981' }
]

// Donut Chart Component for Chain
const ChainDonutChart = () => {
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
          data={chainData}
          innerRadius="65%"
          outerRadius="100%"
          cornerRadius="8px"
          paddingAngle={0}
          dataKey="value"
        />
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mt-2 text-2xl font-bold text-black">517M+</span>
        <span className="text-sm text-[#999]">TOTAL PAIRS</span>
      </div>
    </div>
  )
}

// Donut Chart Component for Category
const CategoryDonutChart = () => {
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
          data={categoryData}
          innerRadius="65%"
          outerRadius="100%"
          cornerRadius="8px"
          paddingAngle={0}
          dataKey="value"
        />
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mt-2 text-2xl font-bold text-black">Top 5</span>
        <span className="text-sm text-[#999]">CATEGORIES</span>
      </div>
    </div>
  )
}

// Legend Component for Chain
const ChainLegend = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      {chainData.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

// Legend Component for Category
const CategoryLegend = () => {
  return (
    <div className="flex flex-col justify-center gap-3">
      {categoryData.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function CryptoAddresses() {
  const [showCommercialDrawer, setShowCommercialDrawer] = useState(false)

  const usageItems = [
    {
      icon: <TestTube className="size-full text-black" />,
      title: 'Research & Testing'
    },
    {
      icon: <Briefcase className="size-full text-black" />,
      title: 'Commercial & Advanced Use'
    }
  ]

  function onBack() {
    window.history.back()
  }

  function handleDownload() {
    const url = 'https://huggingface.co/datasets/Codatta/Crypto-Address-Annotation-10K'
    if (bridge.isInApp()) {
      bridge.downloadDataset('crypto-addresses')
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
        src="https://static.codatta.io/dataset/crypto-addresses.png"
        className="block aspect-[362/240] w-full"
        alt=""
      />

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-5 py-6">
        {/* Title and Description */}
        <div className="mb-9">
          <h1 className="mb-4 text-2xl font-bold text-black">Crypto Addresses/Transactions Labeled data</h1>
          <p className="text-[15px] text-[#999999]">
            Make the semantics of each blockchain entity universally accessible, and understandable, cultivating an
            ecosystem where information is transparent, reliable, and readily available for all.
          </p>
        </div>

        {/* Distribution Charts Section */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2">
          {/* Distribution by Chain */}
          <h2 className="mb-4 text-[17px] font-bold text-black">Key Statistics</h2>
          <div className="mb-4 rounded-[26px] bg-white/50 p-6 shadow-glass">
            <h3 className="mb-4 text-[17px] font-bold text-black">Distribution by Chain</h3>
            <div className="grid grid-cols-2">
              <ChainLegend />
              <ChainDonutChart />
            </div>
          </div>

          {/* Distribution by Category */}
          <div className="rounded-[26px] bg-white/50 p-6 shadow-glass">
            <h3 className="mb-4 text-[17px] font-bold text-black">Distribution by Category</h3>
            <div className="grid grid-cols-2">
              <CategoryLegend />
              <CategoryDonutChart />
            </div>
          </div>
        </div>

        {/* Data Size Metrics */}
        <div className="mb-9 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Download Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">865 </strong>kB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Parquet Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">433 </strong>kB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Total Rows</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">10,000</strong>
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

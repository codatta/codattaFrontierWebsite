import { Search, UtensilsCrossed, ChefHat, Camera, Target, ChevronLeft } from 'lucide-react'
import { Pie, PieChart } from 'recharts'
import { useState } from 'react'
import CommercialAccessDrawer from '@/components/dataset/commercial-access-drawer'
import bridge from '@/components/mobile-app/bridge'

// Chart data - ordered to match UI clockwise from top
const chartData = [
  { name: 'Restaurant food', value: 35461, fill: '#40E1EF' }, // cyan/turquoise (top, ~35%)
  { name: 'Homemade food', value: 46555, fill: '#000000' }, // solid black (right, ~48%)
  { name: 'Others', value: 273, fill: '#D2B48C' }, // light brown/tan (bottom-left, ~1%)
  { name: 'Packaged food', value: 8354, fill: '#7FCDCD' }, // pale blue/aqua (bottom-left, ~8%)
  { name: 'Raw vegs and fruits', value: 9357, fill: '#FF8C69' } // coral/peach (left, ~8%)
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
export default function FoodScience() {
  const [showCommercialDrawer, setShowCommercialDrawer] = useState(false)

  const usageItems = [
    {
      icon: <UtensilsCrossed className="size-full text-black" />,
      title: 'Food Recognition and Classification'
    },
    {
      icon: <Search className="size-full text-black" />,
      title: 'Nutritional Estimation'
    },
    {
      icon: <ChefHat className="size-full text-black" />,
      title: 'Recipe Recommendation Systems'
    },
    {
      icon: <Target className="size-full text-black" />,
      title: 'Health Management and Monitoring'
    },
    {
      icon: <Camera className="size-full text-black" />,
      title: 'Restaurant Automation'
    },
    {
      icon: <Search className="size-full text-black" />,
      title: 'Computer Vision Research'
    }
  ]

  function onBack() {
    window.history.back()
  }

  function handleDownload() {
    const url = 'https://huggingface.co/datasets/Codatta/MM-Food-100K'
    if (bridge.isInApp()) {
      bridge.openBrowser(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F5]">
      <button
        onClick={onBack}
        className="fixed left-5 top-5 flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] text-black shadow-app-btn backdrop-blur-sm"
      >
        <ChevronLeft size={24}></ChevronLeft>
      </button>
      {/* Hero Image Section */}
      <img src="https://static.codatta.io/dataset/food-science.png" className="block aspect-[362/240] w-full" alt="" />

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-5 py-6">
        {/* Title and Description */}
        <div className="mb-9">
          <h1 className="mb-4 text-2xl font-bold text-black">Food Science</h1>
          <p className="text-[15px] text-[#999999]">
            This project releases a comprehensive food image dataset designed for computer vision tasks, including food
            recognition, classification, and nutritional analysis. It aims to provide a reliable resource for advancing
            food AI research and applications.
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
              <strong className="text-[20px] font-semibold text-black">28.6 </strong>MB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Parquet Size</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">7.94 </strong>MB
            </p>
          </div>
          <div className="rounded-[20px] bg-white/60 px-4 py-3 shadow-glass">
            <p className="text-[13px] text-[#999]">Total Rows</p>
            <p className="text-[13px] text-[#999]">
              <strong className="text-[20px] font-semibold text-black">100,000</strong>
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
                  className="mb-3 flex size-11 items-center justify-center rounded-full p-[8px]"
                  style={{
                    background: 'linear-gradient(to right, #e6f3fa 30%, #eff6fa10 100%)',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  {item.icon}
                </div>
                <p className="text-[15px] font-semibold text-black">{item.title}</p>
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

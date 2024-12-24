import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const Statistics = ({ count }: { count: number }) => {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center">
        <h2 className="font-mona text-xl font-bold leading-relaxed">Statistics</h2>
        <Tooltip title="Statistical metrics for this address" className="ml-2 cursor-pointer">
          <QuestionCircleOutlined className="text-xl" />
        </Tooltip>
      </div>

      <div className="h-[120px]] rounded-2xl bg-[#252532] p-6">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        </div>
        <div className="mt-3 text-sm text-[#8D8D93]">Look up requests</div>
      </div>
    </div>
  )
}

export default Statistics

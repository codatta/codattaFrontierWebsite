import ImageEmpty from '@/assets/images/empty.svg'
import { Empty } from 'antd'

export default function CustomEmpty(props: { text?: string }) {
  const { text = 'No Data' } = props
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex aspect-[1/1] items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] p-6">
        <img src={ImageEmpty} alt="" className="w-12" />
      </div>
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  )
}

export function CustomEmpty2() {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ height: 60 }} description={<span>No data</span>}></Empty>
  )
}

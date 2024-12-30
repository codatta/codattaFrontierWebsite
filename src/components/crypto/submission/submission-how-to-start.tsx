import { cn } from '@udecode/cn'
import { Button } from 'antd'
import { ArrowRight, MousePointerClick, SearchCode, Send } from 'lucide-react'

function GuideItem(props: { icon: React.ReactNode; title: string; className?: string }) {
  const { icon, title, className } = props
  return (
    <div className={cn('flex flex-1 flex-col items-center justify-center', className)}>
      <div className="mb-4 text-primary">{icon}</div>
      <div className="font-bold text-white">{title}</div>
    </div>
  )
}

export default function SubmissionHowToStart(props: { className?: string; onShowAllTask: () => void }) {
  const { className, onShowAllTask } = props
  return (
    <div className={cn('text-center', className)}>
      <h1 className="mb-9 text-xl font-bold">How to contribute high quality data?</h1>

      <div className="flex items-center text-base">
        <GuideItem icon={<MousePointerClick size={24} />} title={'Read tutorial carefully'}></GuideItem>
        <ArrowRight className="text-gray-400"></ArrowRight>
        <GuideItem icon={<SearchCode size={24} />} title={'Do your own research'}></GuideItem>
        <ArrowRight className="text-gray-400"></ArrowRight>
        <GuideItem icon={<Send size={24} />} title={'Verify credible evidence'}></GuideItem>
      </div>

      <div className="mt-16">
        <Button shape="round" type="primary" size="large" className="w-40" onClick={onShowAllTask}>
          Got it
        </Button>
      </div>
    </div>
  )
}

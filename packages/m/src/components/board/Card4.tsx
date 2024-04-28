import { Lightbulb } from 'lucide-react'
import CardHeader from './CardHeader'

const Card = ({ num = 0 }: { num: number }) => {
  return (
    <div className="rounded-3xl bg-#21ffe4 bg-opacity-6 mt-16px py-24px px-32px pb-52px overflow-hidden">
      <CardHeader Icon={Lightbulb} title="Submitters" num={num} />
    </div>
  )
}

export default Card

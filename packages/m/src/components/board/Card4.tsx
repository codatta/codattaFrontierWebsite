import { Lightbulb } from 'lucide-react'
import CardHeader from './CardHeader'

const Card = ({ num = 0 }: { num: number }) => {
  return (
    <div className="rounded-3xl bg-#8AD4F90A bg-opacity-6 mt-16px py-21px px-24px pb-35px overflow-hidden">
      <CardHeader Icon={Lightbulb} title="Submitters" num={num} />
    </div>
  )
}

export default Card

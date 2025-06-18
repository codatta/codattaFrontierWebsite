import TransitionEffect from '@/components/common/transition-effect'
import { Card } from './down-list'
import TypeOne from './type-1'
import { TaskType } from './enum'
import { TValidationItem } from '@/api-v1/validation.api'

export const TopList = ({ list }: { list: TValidationItem[] }) => {
  return (
    <TransitionEffect>
      <div>
        <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3">
          {list.map((item, index) => (
            <div key={`${item.submission_id}-${item.task_type}-${index}`}>
              {[
                TaskType.SUBMISSION_IMAGE_ADDRESS,
                TaskType.SUBMISSION_IMAGE_ENTITY,
                TaskType.SUBMISSION_PRIVATE
              ].includes(item.task_type as TaskType) ? (
                <Card data={item} />
              ) : (
                <TypeOne data={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </TransitionEffect>
  )
}

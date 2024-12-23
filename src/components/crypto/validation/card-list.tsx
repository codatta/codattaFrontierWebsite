import { useSnapshot } from 'valtio'

import CustomEmpty from '@/components/common/empty'
import { Card } from '@/components/crypto/validation/down-list'
import TypeOne from '@/components/crypto/validation/type-1'

import { TaskType, validationFilterStore } from '@/stores/validation-filter.store'

const Index = () => {
  const { pageData } = useSnapshot(validationFilterStore)
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {pageData.list?.map((item, index) => (
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
      {pageData.list?.length === 0 && (
        <div className="flex h-[calc(100vh_-_380px)] w-full items-center justify-center">
          <CustomEmpty />
        </div>
      )}
    </div>
  )
}

export default Index

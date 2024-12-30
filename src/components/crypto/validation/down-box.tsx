import { useState, useRef, useEffect, useMemo } from 'react'
import { Carousel, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'
import { useSnapshot } from 'valtio'

import Empty from '@/components/common/empty'
import { DownList } from './down-list'
import Navigation from '@/components/crypto/validation/navigation'

import { validationFilterStore, getDownValidations, TaskType } from '@/stores/validation-filter.store'
import { splitArray } from '@/utils/split-array'
import { CarouselRef } from 'antd/es/carousel'

const TopBox = () => {
  const { downData } = useSnapshot(validationFilterStore)

  const [groupIndex, setGroupIndex] = useState(0)
  const calRef = useRef<CarouselRef>(null)

  const navigate = useNavigate()
  const { ref, width } = useResizeDetector()

  const onClickNav = (type: string) => {
    switch (type) {
      case 'pre':
        calRef?.current?.prev()
        break
      case 'next':
        calRef?.current?.next()
        break
      case 'more':
        navigate(`/app/validation/filter?task_type=${TaskType.SUBMISSION_ONLY_IMAGE}`)
        break
      default:
        break
    }
  }

  useEffect(() => {
    getDownValidations()
  }, [])

  const groups = useMemo(() => {
    console.log('Calculating sum...')
    if (downData.list) {
      return splitArray(downData.list, 6)
    } else {
      return []
    }
  }, [downData.list])

  return (
    <div>
      <h3 className="flex justify-between text-xl font-bold">
        <Navigation
          preDisabled={groupIndex <= 0}
          nextDisabled={groupIndex >= groups.length - 1}
          showArrows={!!groups.length}
          onClick={onClickNav}
        />
      </h3>
      <div className="mt-4 pb-6 sm:px-5 md:px-5 lg:px-8" ref={ref}>
        <Spin spinning={downData?.listLoading}>
          {groups.length === 0 ? (
            <div className="mb-6 rounded-2xl bg-gray-100">
              <Empty />
            </div>
          ) : (
            <Carousel
              className="w-0"
              arrows={false}
              dots={false}
              style={{ width }}
              ref={calRef}
              afterChange={(currentIndex: number) => {
                setGroupIndex(currentIndex)
              }}
              infinite={false}
            >
              {groups?.map((group, _index) => (
                <div key={'validation-card-group' + _index}>
                  <DownList list={group} groupOne={_index === 0} />
                </div>
              ))}
            </Carousel>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default TopBox

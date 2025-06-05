import { useState, useRef, useEffect, useMemo } from 'react'
import { Carousel, Spin } from 'antd'
import { useResizeDetector } from 'react-resize-detector'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'

import Empty from '@/components/common/empty'
import { TopList } from './top-list'
import Navigation from './navigation'

import { validationFilterStore, getValidations } from '@/stores/validation-notstart.store'
import { splitArray } from '@/utils/split-array'

import DetailsV2 from '@/components/crypto/validation/details-v2'
import Details from '@/components/crypto/validation/details'
import { CarouselRef } from 'antd/es/carousel'
import { TValidationItem } from '@/api-v1/validation.api'

const TopBox = () => {
  const { topData } = useSnapshot(validationFilterStore)
  const [groupIndex, setGroupIndex] = useState(0)
  const [page, setPage] = useState(1)
  const carouselRef = useRef<CarouselRef>(null)
  const navigate = useNavigate()
  const { ref, width } = useResizeDetector()

  const onClickNav = (type: string) => {
    switch (type) {
      case 'pre':
        setGroupIndex(groupIndex - 1)
        carouselRef?.current?.prev()
        break
      case 'next':
        setGroupIndex(groupIndex + 1)
        carouselRef?.current?.next()
        break
      case 'more':
        navigate(`/app/crypto/validation/list`)
        break
      default:
        break
    }
  }

  const groups = useMemo(() => {
    if (topData.list) {
      const newGroups = splitArray<TValidationItem>(topData.list as [], 6)
      return newGroups
    } else {
      return []
    }
  }, [topData.list])

  useEffect(() => {
    if (groupIndex >= groups.length - 1) {
      setPage((page) => page + 1)
    }
  }, [groupIndex, groups])

  useEffect(() => {
    getValidations({ page })
  }, [page])

  return (
    <div>
      <div className="flex justify-between text-xl font-bold">
        <Navigation
          preDisabled={groupIndex <= 0}
          nextDisabled={groupIndex > groups.length - 1}
          showArrows={!!groups.length}
          onClick={onClickNav}
        />
      </div>
      <div className="mt-3" ref={ref}>
        <Spin spinning={topData?.listLoading}>
          {groups.length === 0 ? (
            <div className="mb-6 rounded-2xl bg-white/5">
              <Empty />
            </div>
          ) : (
            <Carousel
              className="w-0"
              arrows={false}
              dots={false}
              style={{ width }}
              infinite={false}
              ref={carouselRef}
              initialSlide={groupIndex}
            >
              {groups.map((group, _index) => (
                <div key={'validation-card-group' + _index}>
                  <TopList list={group} />
                </div>
              ))}
            </Carousel>
          )}
        </Spin>
      </div>

      <DetailsV2 />
      <Details />
    </div>
  )
}

export default TopBox

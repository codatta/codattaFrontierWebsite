import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Input, Select, Button, message, Spin, Space } from 'antd'

import BountyCard from '@/components/crypto/bounty/bounty-card'
import TransitionEffect from '@/components/common/transition-effect'
import { BountyListFilter, BountyType } from '@/api-v1/bounty.api'
import { useEffect, useState } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bountyStoreActions, useBountyStore } from '@/stores/bounty.store'
import CustomEmpty from '@/components/common/empty'
import { useOptionsWithExtra } from '@/stores/config.store'
import { TPagination } from '@/api-v1/request'

export default function Component() {
  // get query string here
  const [searchParams] = useSearchParams()
  const level = searchParams.get('level')
  const category = searchParams.get('category')
  const type = searchParams.get('type') as BountyType
  const title = searchParams.get('title') || 'Bounty Hunting'

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { bountyList, total } = useBountyStore()
  const { networksWithIcon } = useOptionsWithExtra()
  const [pagination] = useState<TPagination>({ current: 1, pageSize: 36 })

  const [filters, setFilters] = useState<BountyListFilter>({
    listType: type || BountyType.Address,
    status: 'NotStart',
    category: category || undefined,
    address: undefined,
    points_sort: 'DESC',
    entity: undefined,
    network: undefined,
    level: level || undefined
  })

  useEffect(() => {
    loadData(filters, pagination)
  }, [filters, pagination])

  async function loadData(filter: BountyListFilter, pagination: TPagination) {
    setLoading(true)
    try {
      await bountyStoreActions.getBountyList(filter, { current: 1, pageSize: pagination.pageSize })
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function loadMore() {
    setLoading(true)
    try {
      await bountyStoreActions.loadMoreBounty()
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  function handleListTypeChange(listType: BountyType) {
    const extra = {
      address: undefined,
      network: undefined,
      entity: undefined
    }

    setFilters({ ...filters, listType, ...extra })
  }

  // function handleShowAll() {
  //   localStorage.setItem('bounty_first_visit', 'false')
  //   setFirstVisit(false)
  // }

  return (
    <TransitionEffect className="">
      <div className="mb-6 flex items-center gap-1 md:flex-auto">
        <a onClick={() => navigate(-1)}>
          <ArrowLeft size={36} className="cursor-pointer p-1"></ArrowLeft>
        </a>
        <h1 className="text-xl font-bold">{title} Tasks</h1>
      </div>

      <div className="mb-5 flex flex-wrap gap-4">
        <Select
          className="flex-1 md:w-32 md:flex-none"
          size="large"
          defaultValue={filters.listType}
          disabled={type ? true : false}
          options={[
            { label: 'Entity', value: BountyType.Entity },
            { label: 'Address', value: BountyType.Address }
          ]}
          onChange={handleListTypeChange}
        ></Select>

        <Select
          className="flex-1 md:w-32 md:flex-none"
          size="large"
          defaultValue="NotStart"
          options={[
            { label: 'Not Start', value: 'NotStart' },
            { label: 'On Hold', value: 'OnHold' },
            { label: 'In Progress', value: 'InProgress' },
            { label: 'Completed', value: 'Completed' }
          ]}
          onChange={(v) => setFilters({ ...filters, status: v })}
        ></Select>

        <Button
          className="flex items-center gap-2 bg-transparent shadow-none outline-none"
          size="large"
          onClick={() => {
            setFilters({ ...filters, points_sort: filters.points_sort === 'DESC' ? 'ASC' : 'DESC' })
          }}
        >
          Point
          {filters.points_sort === 'DESC' ? <CaretDownOutlined size={8} /> : <CaretUpOutlined size={8} />}
        </Button>

        <Space.Compact className="ml-auto w-full md:w-2/5 md:max-w-screen-sm">
          {filters.listType === BountyType.Entity && (
            <Select
              placeholder="Network"
              className="w-[200px]"
              popupMatchSelectWidth={140}
              allowClear
              showSearch
              size="large"
              onChange={(network) => setFilters({ ...filters, network })}
              options={networksWithIcon}
            />
          )}
          <Input.Search
            size="large"
            onSearch={(v) => {
              if (filters.listType === BountyType.Entity) {
                setFilters({ ...filters, address: v || undefined, entity: undefined })
              } else if (filters.listType === BountyType.Address) {
                setFilters({ ...filters, entity: v || undefined, address: undefined, network: undefined })
              }
            }}
          ></Input.Search>
        </Space.Compact>
      </div>

      <Spin spinning={loading}>
        <div
          id="hunting-list-wrapper"
          className="h-[calc(100vh-224px)] overflow-y-scroll pb-10 pt-2 md:h-[calc(100vh-164px)]"
        >
          {bountyList.length === 0 && (
            <div className="flex size-full items-center justify-center">
              <CustomEmpty></CustomEmpty>
            </div>
          )}

          {!!bountyList.length && (
            <InfiniteScroll
              scrollableTarget="hunting-list-wrapper"
              loader={null}
              next={loadMore}
              dataLength={bountyList.length}
              hasMore={bountyList.length < total}
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {bountyList.map((item) => {
                  return (
                    <BountyCard
                      bounty={item}
                      key={item.hunting_entity_task_id || item.hunting_address_task_id}
                    ></BountyCard>
                  )
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </Spin>

      {/* <BountyShareModal open={!!shareItem} bounty={shareItem} type={filters.listType} onClose={() => setShareItem(null)} /> */}
    </TransitionEffect>
  )
}

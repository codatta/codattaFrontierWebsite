import dayjs from 'dayjs'
import { Col, Row, List, Spin, Button, message } from 'antd'
import { useEffect, useState } from 'react'

import ReputationRate from '@/components/common/reputation-rate'
import Empty from '@/components/common/empty'

import IconDownOne from '@/assets/icons/settings/down-one.svg'
import IconUpOne from '@/assets/icons/settings/up-one.svg'

import { useUserStore } from '@/stores/user.store'

import reputationApi, { type Reputation } from '@/apis/reputation.api'

export default function UserInfoReputation() {
  const { info } = useUserStore()

  return (
    <div>
      <h3 className="mb-6 flex items-center justify-between text-[32px] font-bold leading-[48px]">
        <span>Reputation</span>
        <ReputationRate rate={info?.user_reputation || 0} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
        {/* <div className="flex items-center gap-1 text-base font-normal">
          <ReputationRate
            rate={info?.user_reputation || 0}
            size={20}
            // className="font-inter text-xl font-bold text-[#875DFF]"
          ></ReputationRate>
          <span>/</span>
          100
        </div> */}
      </h3>
      <ReputationRecords></ReputationRecords>
    </div>
  )
}

function RecordItem(props: { record: Reputation }) {
  const { record } = props
  return (
    <Row className="flex w-full items-center justify-between rounded-lg py-3">
      <Col span={10}>{record.memo}</Col>
      <Col span={8} className="flex items-center justify-center gap-1 text-sm">
        <span>Reputation</span>
        {record.type === 'INCREASE' ? (
          <div className="flex h-6 items-center gap-1 rounded-[20px] px-1 text-sm text-primary">
            {' '}
            <IconUpOne color="#875DFF" size={16} /> Up{' '}
          </div>
        ) : null}
        {record.type === 'DECREASE' ? (
          <div className="flex h-6 items-center gap-1 px-1 text-sm text-[#FFA001]">
            <IconDownOne color="#FFA001" size={16} /> Down{' '}
          </div>
        ) : null}
      </Col>
      <Col span={6} className="text-right text-gray-300">
        {dayjs(record.create_at * 1000).format('YYYY-MM-DD HH:mm')}
      </Col>
    </Row>
  )
}

function ReputationRecords() {
  const [list, setList] = useState<Reputation[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  async function getReputation(page: number) {
    setLoading(true)
    try {
      const res = await reputationApi.getReputations({
        page,
        page_size: 20
      })
      setTotal(res.total_count)
      setList((oldlist) => [...oldlist, ...res.data])
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getReputation(page)
  }, [page])

  return (
    <div>
      <Spin spinning={loading && page === 1}>
        <div>
          {list.length > 0 ? (
            <List
              bordered
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item>
                  <RecordItem key={`${Date.now()}-${index}`} record={item} />
                </List.Item>
              )}
            />
          ) : (
            <div className="flex h-[calc(100vh_-_300px)] items-center justify-center">
              <Empty />
            </div>
          )}
        </div>
        <div className="flex justify-center py-6">
          {total > list.length && (
            <Button loading={loading} onClick={() => setPage((old) => old + 1)}>
              Load more
            </Button>
          )}
        </div>
      </Spin>
    </div>
  )
}

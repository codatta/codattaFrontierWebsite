import ReputationRate from '@/components/common/reputation-rate'
import TransitionEffect from '@/components/common/transition-effect'

import userApiV1 from '@/api-v1/user.api'
import reputationApi, { type Reputation } from '@/api-v1/reputation.api'
import IconDownOne from '@/assets/icons/settings/down-one.svg'
import IconUpOne from '@/assets/icons/settings/up-one.svg'
import { Col, Row, List, Spin, Button, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import Empty from '@/components/common/empty'

function RecordItem(props: { record: Reputation }) {
  const { record } = props
  return (
    <Row className="flex w-full items-center justify-between rounded-lg bg-gray-100 py-3">
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
        {dayjs(record.date).format('YYYY-MM-DD HH:mm')}
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
              {' '}
              Load more
            </Button>
          )}
        </div>
      </Spin>
    </div>
  )
}

export default function SettingReputation() {
  const [reputation, setReputation] = useState('0')
  const [_rate, setRate] = useState<number>(0)

  useEffect(() => {
    userApiV1.getReputation().then((res) => {
      setReputation(res)
      let tempRate = parseFloat(res)
      if (Number.isNaN(tempRate)) tempRate = 0
      if (tempRate < 0) tempRate = 0
      if (tempRate > 5) tempRate = 5

      setRate(tempRate)
    })
  }, [])

  return (
    <TransitionEffect className="flex-auto px-6">
      <div className="flex justify-between">
        <div className="mb-4 flex items-center gap-4">
          {/* <span className="text-20px font-600 leading-30px mr-1">L{rate}</span> */}
          <span>Reputation</span>
          <ReputationRate rate={reputation} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
        </div>
        {/* <div className="m-b-16px">
            <ReputationRate rate={reputation} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
          </div> */}
      </div>

      <ReputationRecords></ReputationRecords>
      {/* <Tour name={TourType.Reputation} /> */}
    </TransitionEffect>
  )
}

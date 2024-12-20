import reputationApi, { type Reputation } from '@/apis/reputation.api'
import IconDownOne from '@/assets/components/down-one.svg'
import IconUpOne from '@/assets/components/up-one.svg'
import { SoundButton } from '@/components/common/sound-button'
import useRequest from '@/hooks/useRequest'
import { Col, Row, List, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import Empty from '../common/empty'

function RecordItem(props: { record: Reputation }) {
  const { record } = props
  return (
    <Row className="flex w-full items-center justify-between rounded-lg py-3">
      <Col span={10}>{record.memo}</Col>
      <Col span={8} className="flex items-center justify-center gap-1 text-sm">
        <span>Reputation</span>
        {record.type === 'INCREASE' ? (
          <div className="bg-opacity-24 flex h-6 items-center gap-1 rounded-[20px] px-1 text-sm text-primary">
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

export default function ReputationRecords() {
  const [page, setPage] = useState(0)

  const [pageData, loading, loadData] = useRequest(
    reputationApi.getReputations,
    (data, oldData) => {
      return {
        ...data,
        data: (oldData?.data ?? []).concat(data.data)
      }
    }
  )

  function handleLoadMore() {
    const _page = page + 1
    setPage(_page)
    loadData({ page: _page, page_size: 10 })
  }

  useEffect(() => {
    handleLoadMore()
  }, [])

  return (
    <Spin spinning={loading && page === 1}>
      <div>
        {pageData?.data?.length > 0 ? (
          <List
            bordered
            dataSource={pageData.data}
            renderItem={(item, index) => (
              <List.Item>
                <RecordItem key={`${Date.now()}-${index}`} record={item} />
              </List.Item>
            )}
          />
        ) : (
          // pageData.data.map((item, index) => <RecordItem key={`${Date.now()}-${index}`} record={item} />)
          <div className="flex h-[calc(100vh_-_300px)] items-center justify-center">
            <Empty />
          </div>
        )}
      </div>
      <div className="flex justify-center py-6">
        {pageData?.total_count > pageData?.data.length && (
          <SoundButton loading={loading} onClick={handleLoadMore}>
            {' '}
            Load more
          </SoundButton>
        )}
      </div>
    </Spin>
  )
}

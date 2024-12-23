import { ClockCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Space, Tag, Timeline, type FormRule } from 'antd'
import dayjs from 'dayjs'
import { isNil, omitBy } from 'lodash'
import { useState } from 'react'
import FileUpload from '@/components/common/file-upload'
import EvidenceDetail from '@/components/crypto/evidence/evidence-detail'
import Copy from '@/components/common/copy'
import { TEvidence } from '@/api-v1/validation.api'

interface SubmissionBasicInfoProps {
  network: string
  address: string
  category: string
  entity: string
  evidence: TEvidence[] | TEvidence
  onAppend?: (evidence: TEvidence) => Promise<void>
}

export default function SubmissionBasicInfo(props: SubmissionBasicInfoProps) {
  const { network, address, category, entity } = props

  const evidences = (Array.isArray(props.evidence) ? props.evidence : [props.evidence]).filter(Boolean)

  return (
    <div className="mb-4">
      <h4 className="mb-2 font-medium">Basic information</h4>
      <div className="overflow-auto rounded-lg bg-[rgba(43,0,85,0.02)] p-4">
        <Row gutter={[16, 8]}>
          <Col span={4} className="text-right">
            {' '}
            Network:
          </Col>
          <Col span={20}>{network}</Col>
          <Col span={4} className="text-right">
            {' '}
            Address:
          </Col>
          <Col span={20} className="flex items-center gap-2">
            {address}

            <div>
              <Copy content={address} />
            </div>
          </Col>
          <Col span={4} className="text-right">
            {' '}
            Category:
          </Col>
          <Col span={20}>
            <div className="flex flex-wrap gap-y-2">
              {category?.split(',').map((item) => {
                return <Tag key={item}>{item}</Tag>
              })}{' '}
            </div>
          </Col>
          <Col span={4} className="text-right">
            {' '}
            Entity:
          </Col>
          <Col span={20}>{entity}</Col>
          {evidences && (
            <>
              <Col span={4} className="text-right">
                Evidence:&nbsp;
              </Col>
              <Col span={20} className="mt-2">
                <Timeline
                  items={[
                    ...evidences.map((evidence) => ({
                      dot: <ClockCircleOutlined size={12} />,
                      children: (
                        <div className="flex flex-col gap-3">
                          <h3 className="font-medium leading-relaxed empty:hidden">
                            {evidence.date && dayjs(evidence.date).format('YYYY/MM/DD')}
                          </h3>
                          <EvidenceDetail evidence={evidence} />
                        </div>
                      )
                    })),
                    ...(props.onAppend
                      ? [
                          {
                            children: (
                              <AddEvidence
                                onFinish={(evidence) => {
                                  props.onAppend?.(omitBy(evidence, isNil) as TEvidence)
                                }}
                              />
                            )
                          }
                        ]
                      : [])
                  ]}
                />
              </Col>
            </>
          )}
        </Row>
      </div>
    </div>
  )
}

function AddEvidence(props: { onFinish?: (evidence: TEvidence) => void }) {
  const [editing, setEditing] = useState(false)

  const emptyRule: FormRule = ({ getFieldsValue }) => ({
    validator() {
      const values = getFieldsValue()
      const isEmpty = Object.keys(values).every((key) => !values[key])
      return isEmpty ? Promise.reject('Evidence can not be empty') : Promise.resolve()
    }
  })

  if (!editing) return <Button onClick={() => setEditing(true)}>Add Evidence</Button>

  return (
    <Form<TEvidence> onFinish={props.onFinish}>
      <Form.Item name="hash" rules={[emptyRule]}>
        <Input placeholder="TxHash" />
      </Form.Item>
      <Form.Item name="text" rules={[emptyRule]}>
        <Input placeholder="Text" />
      </Form.Item>
      <Form.Item
        name="link"
        rules={[
          {
            type: 'url',
            message: 'link is not a valid url'
          },
          emptyRule
        ]}
      >
        <Input placeholder="Link" />
      </Form.Item>
      <Form.Item name="files" rules={[emptyRule]}>
        <FileUpload accept="image/*" listType="picture">
          <Button icon={<UploadOutlined />}>Upload</Button>
        </FileUpload>
      </Form.Item>
      <Form.Item>
        <Space size={4}>
          <Button htmlType="button" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

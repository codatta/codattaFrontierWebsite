import { useEffect, useState } from 'react'
import { Button, ConfigProvider, Form, Input, Radio, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { UploadOutlined } from '@ant-design/icons'

import FileUpload from '@/components/common/file-upload'

import { VALIDATION_TIPS } from '@/config/validation-tips'
import { Rule } from 'antd/es/form'
import { TSubmitValidationParams } from '@/api-v1/validation.api'

export interface ValidationActionProps {
  onFinish?: (formValue: TSubmitValidationParams) => void
  initialValue?: TSubmitValidationParams
  editable?: boolean
}

const reasonChoices = [
  'Address does not exist',
  'Evidence does not match data information',
  'Invalid evidence'
]

export default function ValidationAction(props: ValidationActionProps) {
  const [form] = useForm()
  const editable = props.editable ?? true
  const [reasonChoice, setReasonChoice] = useState(1)
  const [decision, setDecision] = useState('')

  useEffect(() => {
    form.resetFields()
  }, [props.initialValue, form])

  useEffect(() => {
    if (decision === 'REJECT' && reasonChoice !== 3) {
      form.setFieldValue('reason', {
        files: [],
        text: reasonChoices[reasonChoice]
      })
    } else {
      form.setFieldValue('reason', { files: [], text: '' })
    }
  }, [reasonChoice, form, decision])

  const reasonRules: Rule[] = [
    ({ getFieldValue }) => ({
      validator() {
        const decision = getFieldValue('decision')
        const reason = getFieldValue('reason')
        if (decision === 'REJECT') {
          const isEmpty = !reason || (!reason.text && !reason.files?.length)
          const isReasonEmpty = !reason
          return isEmpty
            ? Promise.reject(
                isReasonEmpty
                  ? 'Please provide the reason(s) for rejection.'
                  : ''
              )
            : Promise.resolve()
        } else {
          return Promise.resolve()
        }
      }
    })
  ]

  return (
    <Form
      form={form}
      disabled={!editable}
      initialValues={props.initialValue}
      onFinish={props.onFinish}
      labelCol={{ span: 9 }}
      labelAlign="left"
      name="validation"
      className="flex h-full flex-col"
      requiredMark={false}
    >
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              borderRadius: 9999
            }
          }
        }}
      >
        <Form.Item
          label={
            <Tooltip
              title={VALIDATION_TIPS.decision}
              className="cursor-pointer"
            >
              Solid Decision
            </Tooltip>
          }
          rules={[
            {
              required: true,
              message:
                'Please ensure you have selected a decision or opinion before submitting.'
            }
          ]}
          // tooltip="Please choose your solid decision carefully, too many wrong decisions may impact your reputation."
          name="decision"
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => setDecision(e.target.value)}
          >
            <Radio.Button value="APPROVE" className="w-24 px-0 text-center">
              Approve
            </Radio.Button>
            <Radio.Button value="REJECT" className="w-24 px-0 text-center">
              Reject
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </ConfigProvider>

      {/* {false && (
        <>
          <span className="-mt-6">OR</span>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  borderRadius: 9999
                }
              }
            }}
          >
            <Form.Item
              label={
                <Tooltip
                  title={VALIDATION_TIPS.opinion}
                  className="cursor-pointer"
                >
                  Express Opinion
                </Tooltip>
              }
              name="decision"
              rules={[
                {
                  required: true,
                  message:
                    'Please ensure you have selected a decision or opinion before submitting.'
                }
              ]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="UPVOTE">
                  <LikeOutlined /> Upvote
                </Radio.Button>
                <Radio.Button value="DOWNVOTE">
                  <DislikeOutlined /> Downvote
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </ConfigProvider>
        </>
      )} */}
      <div className="mb-3 text-sm">
        <Tooltip title={VALIDATION_TIPS.reason} className="cursor-pointer">
          Reason
        </Tooltip>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-white/10 p-3 text-sm text-[#2B005506]">
        {decision === 'REJECT' && (
          <Radio.Group
            name="reasonChoice"
            defaultValue={0}
            onChange={(e) => setReasonChoice(e.target.value)}
          >
            <div className="my-4 flex items-center justify-between">
              <span className="text-sm">{reasonChoices[0]}</span>
              <span>
                <Radio value={0}></Radio>
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm">{reasonChoices[1]}</span>
              <span>
                <Radio value={1}></Radio>
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm">{reasonChoices[2]}</span>
              <span>
                <Radio value={2}></Radio>
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm">Others</span>
              <span>
                <Radio value={3}></Radio>
              </span>
            </div>
          </Radio.Group>
        )}

        {decision === 'REJECT' && reasonChoice !== 3 ? (
          <Form.Item hidden={true} name={['reason', 'text']}>
            <Input />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              className="mb-2 [&_.ant-row]:block"
              name={['reason', 'text']}
              dependencies={['decision', ['reason', 'files']]}
              rules={reasonRules}
              colon={false}
              label={
                <Tooltip
                  title={VALIDATION_TIPS.reason}
                  className="cursor-pointer"
                >
                  <span className="mb-3 text-sm font-medium">Reason</span>
                </Tooltip>
              }
            >
              <Input.TextArea
                autoSize={{
                  minRows: 8
                }}
                placeholder={`Please state reasons behind your solid decision and, where applicable, provide relevant evidence. Such evidence may include:
      • Transaction hashes
      • Transaction screenshots
      • Social media posts
      • Links from blockchain explorers`}
              />
            </Form.Item>
            <Form.Item
              className="mb-0"
              name={['reason', 'files']}
              rules={reasonRules}
              dependencies={['decision']}
            >
              <FileUpload listType="picture" multiple accept="image/*">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </FileUpload>
            </Form.Item>
          </>
        )}
      </div>
    </Form>
  )
}

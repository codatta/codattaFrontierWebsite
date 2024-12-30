import { useState, useEffect, useRef } from 'react'
import { Button, Spin, Form, Input, Radio, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSnapshot } from 'valtio'

import Network from '@/components/common/network-icon'
import Copy from '@/components/common/copy'
import validationApi, { TValidationDetail } from '@/api-v1/validation.api'
import type1 from '@/assets/crypto/validation-type-1.png'
import type3 from '@/assets/crypto/validation-type-3.png'
import type4 from '@/assets/crypto/validation-type-4.png'
import Imgs from './imgs'

import { createValidation, validationDetailStore, setOpen } from '@/stores/validation-details.store'
import { TaskType } from '../enum'

const { TextArea } = Input

const standbyImg: { [key: string]: string } = {
  SUBMISSION_PRIVATE: type1,
  SUBMISSION_IMAGE_ADDRESS: type3,
  SUBMISSION_IMAGE_ENTITY: type4
}

const Actions = ({
  validation,
  setResult,
  setDecision,
  reload
}: {
  validation: TValidationDetail
  reload: () => void
  setDecision: (decision: string) => void
  setResult: (result: string) => void
}) => {
  const [form] = useForm()
  const submitBtn = useRef<HTMLDivElement>(null)
  const rejectBtn = useRef<HTMLDivElement>(null)
  const approveBtn = useRef<HTMLDivElement>(null)

  const decision = Form.useWatch('decision', form)
  const [inAsk, setInAsk] = useState(false)
  const { inCreation, selectedItem } = useSnapshot(validationDetailStore)

  useEffect(() => {
    if (validation) {
      if (!['NotStart', 'OnHold'].includes(selectedItem?.status || '')) {
        let reason
        if (typeof validation.decision?.reason === 'object') {
          reason = validation.decision?.reason
        }
        if (typeof validation.decision?.reason === 'string') {
          try {
            reason = JSON.parse(validation.decision?.reason)
          } catch (err) {
            console.log(err)
            reason = {}
          }
        }

        form.setFieldsValue({
          decision: validation.decision?.decision,
          reason
        })
      }
    }
  }, [validation, selectedItem, form])

  const onSubmit = async () => {
    const value = await form.getFieldsValue()
    createValidation({
      ...value,
      submission_id: selectedItem?.submission_id,
      task_type: selectedItem?.task_type
    })
      .then(() => {
        setDecision(decision)
        setResult('success')
        setOpen(false)
      })
      .catch((err) => {
        setResult(err?.errorMessage || err?.message)
        setOpen(false)
      })
  }

  const handleHold = () => {
    setInAsk(true)
    validationApi
      .holdValidation(selectedItem?.submission_id || '', selectedItem?.stage || '', selectedItem?.task_type as string)
      .then(() => {
        message.success('Validation has been held for review')
        setOpen(false)
        reload()
      })
      .catch((err) => {
        message.error(err?.message)
      })
      .finally(() => setInAsk(false))
  }

  const type = selectedItem?.task_type
  const evidence = validation?.basic_info?.evidence ? JSON.parse(validation?.basic_info?.evidence) : {}
  console.log(evidence, 'input tsx evidence print')
  const showPoint =
    selectedItem?.status === 'Completed' ? validation?.decision?.send_point : validation?.decision?.point || 0
  return (
    <div>
      <div className="p-4 pt-2">
        <Spin spinning={!validation}>
          <div>
            {[
              TaskType.SUBMISSION_PRIVATE,
              TaskType.SUBMISSION_IMAGE_ADDRESS,
              TaskType.SUBMISSION_IMAGE_ENTITY
            ].includes(type as TaskType) && (
              <div className="relative mb-6 w-full overflow-hidden rounded-xl bg-primary/10 pt-[360px]">
                <div className="absolute top-0 size-full overflow-hidden">
                  {evidence?.files?.[0] ? (
                    <Imgs files={evidence?.files} />
                  ) : (
                    <img className="object-scale-down" src={standbyImg[validation?.task_type]} alt="" />
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              {selectedItem?.status !== 'OnHold' && (
                <div className="my-[2px] mb-2 inline-block h-7 rounded-2xl bg-primary/20 px-3 align-middle text-primary">
                  <div className="flex size-full items-center">
                    {showPoint || 0} {(showPoint as number) > 1 ? 'Points' : 'Point'}
                  </div>
                </div>
              )}

              {type === TaskType.SUBMISSION_PRIVATE && (
                <div className="text-lg font-bold">Is the image sourced from third-party publicly available data?</div>
              )}

              {type === TaskType.SUBMISSION_HASH_ADDRESS && (
                <div className="text-lg font-bold">Does the transaction hash include the address?</div>
              )}

              {type === TaskType.SUBMISSION_IMAGE_ADDRESS && (
                <div className="text-lg font-bold">Is the image or description related to the address?</div>
              )}

              {type === TaskType.SUBMISSION_IMAGE_ENTITY && (
                <div className="text-lg font-bold">Is the image or description related to the entity?</div>
              )}
            </div>
            {/* )} */}
            {[TaskType.SUBMISSION_IMAGE_ADDRESS, TaskType.SUBMISSION_IMAGE_ENTITY].includes(type as TaskType) &&
              evidence && (
                <div className="mb-4 text-gray-400">
                  <div className="mb-1 flex">
                    <div className="leading-4">Description:</div>
                    <div className="ml-2 leading-4">
                      {evidence.translation && evidence.translation.trim() !== evidence.text?.trim() && (
                        <>
                          <div>AI Translator:</div>
                          <pre className="text-wrap break-all">{evidence.translation}</pre>
                          <div className="mt-4">Original:</div>
                        </>
                      )}
                      <pre className="text-wrap break-all">{evidence.text}</pre>
                    </div>
                  </div>
                </div>
              )}
            {/* Address */}
            {[TaskType.SUBMISSION_HASH_ADDRESS, TaskType.SUBMISSION_IMAGE_ADDRESS].includes(type as TaskType) && (
              <div className="my-2 flex items-center gap-[6px] text-sm">
                <span className="text-[#84828E]">Address:</span>
                <Network size={16} type={validation?.basic_info?.network} />
                <a href={validation?.explorer_link?.address_link} target="_blank" className="break-all">
                  {validation?.basic_info?.address}
                </a>
                {validation?.basic_info?.address && (
                  <Copy
                    size={13}
                    className="w-[13px] shrink-0 cursor-pointer text-white"
                    content={validation?.basic_info?.address}
                  />
                )}
              </div>
            )}
            {/* TxHash */}
            {/* {type === 2 && (
            <div className="gap-6px flex items-center text-sm">
              <span className="text-#84828E">TxHash:</span>
              <div className="flex flex-auto justify-between">
                0x4e261974a3ba43d601e5b6acbb37c04c952def18ac0e926d1ef13ecb77925cf7
                <Copy
                  size={13}
                  className="w-13px text-#fff shrink-0 cursor-pointer"
                  content={'0x12cF08eb6d78858251Bf8D8a5C344209Bc280e73'}
                />
              </div>
            </div>
          )} */}
            {type === TaskType.SUBMISSION_IMAGE_ENTITY && (
              <div>
                <span className="mt-[12px] text-[#84828E]">Entity: </span>
                <span className="ml-[6px] text-sm">{validation?.basic_info?.entity}</span>
              </div>
            )}
          </div>
          {/* )} */}
        </Spin>
        <div className="mt-10">
          <Form
            form={form}
            disabled={!['NotStart', 'OnHold'].includes(selectedItem?.status || '') || inCreation || !validation}
          >
            <div className="flex justify-between">
              <div className="text-sm font-semibold">Action *</div>
              <div>
                <Form.Item name="decision" noStyle>
                  <Radio.Group buttonStyle="solid">
                    <div ref={approveBtn} className="inline-block">
                      <Radio value="APPROVE">Approve</Radio>
                    </div>
                    <div ref={rejectBtn} className="ml-2 inline-block">
                      <Radio value="REJECT">Reject</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            {decision && (
              <div className="mt-4">
                <Form.Item name={['reason', 'text']} noStyle>
                  <TextArea
                    maxLength={10000}
                    autoSize={{ minRows: 2, maxRows: 2 }}
                    placeholder="Please provide reasons for your decison."
                  />
                </Form.Item>
              </div>
            )}
          </Form>
        </div>
      </div>
      {['NotStart', 'OnHold'].includes(selectedItem?.status || '') && (
        <div className="flex flex-row-reverse items-center border-t-4 border-t-white/10 pb-4 pt-6">
          {/* <div className="flex">
          <StatusTag validation={selectedItem} />
          <span>Share</span>
        </div> */}
          <div className="flex items-center">
            {selectedItem?.status === 'NotStart' && (
              <Button
                className="text-white [&>span]:hover:text-[#9a7ae8] [&>span]:hover:disabled:text-white/25"
                type="link"
                onClick={handleHold}
                disabled={inCreation || !validation}
                loading={inAsk}
              >
                Accept the task
              </Button>
            )}
            <div className="ml-4 w-40" ref={submitBtn}>
              <Button
                type="primary"
                shape="round"
                onClick={onSubmit}
                disabled={!decision || inAsk}
                block
                loading={inCreation}
                className="h-11 text-xs font-semibold disabled:bg-primary/50 disabled:text-white/10"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Actions

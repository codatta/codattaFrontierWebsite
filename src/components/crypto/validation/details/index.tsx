import { useEffect, useState } from 'react'
import { Button, Drawer, Flex, Modal, Result, Tooltip, message } from 'antd'
import {
  CloseOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import { useSnapshot } from 'valtio'

import { VALIDATION_TIPS } from '@/config/validation-tips'

import ValidationAction from './validation-action'
import ValidationDetail from './validation-detail'
import validationApi, {
  TValidationItem,
  TValidationDetail,
  TSubmitValidationParams
} from '@/api-v1/validation.api'
import {
  getTopValidations,
  getDownValidations,
  changeValidationFilter,
  validationFilterStore
} from '@/stores/validation-filter.store'
import {
  createValidation,
  validationStore,
  setSelectedItem,
  setOpen
} from '@/stores/validation.store'
import { getValidations } from '@/stores/validation-notstart.store'

const Index = (props: { onRefresh?: () => void }) => {
  const {
    pageData: { page }
  } = useSnapshot(validationFilterStore)
  const { inCreation, selectedItem, open } = useSnapshot(validationStore)
  const [result, setResult] = useState<string>('')
  const [validation, setValidation] = useState<TValidationDetail>()
  const [lastSubmitted, setLastSubmitted] = useState<{
    validation: TValidationItem
    formValue: TSubmitValidationParams
  } | null>(null)
  const [initialValue, setInitialValue] = useState<TSubmitValidationParams>()
  const [inAsk, setInAsk] = useState(false)
  const editable = ['NotStart', 'OnHold'].includes(selectedItem?.status || '')

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem, 'selected Item')
      validationApi
        .getValidationDetail(
          selectedItem.submission_id,
          selectedItem.task_type,
          selectedItem.current_stage || selectedItem.stage
        )
        .then(({ data }) => {
          setValidation(data)
          console.log('set validation', data)

          if (!editable) {
            let reason
            if (typeof data?.decision?.reason === 'object') {
              reason = data.decision.reason
            }
            if (typeof data?.decision?.reason === 'string') {
              try {
                reason = JSON.parse(data.decision.reason)
              } catch (err) {
                console.log(err.message)
                reason = {}
              }
            }

            setInitialValue({
              submission_id: data.submission_id,
              decision: data?.decision?.decision || '',
              reason: reason
            })
          }
        })
        .catch((err) => {
          console.log('ioioio', err)
          message.error(err?.errorMessage ?? 'Something went wrong0000')
          // setOpen(false)
          setSelectedItem(null)
        })
    }
  }, [selectedItem, setValidation, editable])

  function handleActionFinish(formValue: TSubmitValidationParams) {
    console.log('ioioio', formValue)
    if (!selectedItem) return
    setLastSubmitted({ formValue, validation: selectedItem })
    createValidation({
      ...formValue,
      reason: formValue.reason,
      submission_id: selectedItem?.submission_id
    })
      .then(() => {
        setResult('success')
        setOpen(false)
      })
      .catch((err) => {
        setResult(err?.errorMessage || err?.message)
        setOpen(false)
      })
  }

  function closeResult() {
    setResult('')
    setLastSubmitted(null)
    if (location.pathname === '/app/validation/filter') {
      changeValidationFilter({ pageData: { page } })
    }
    if (location.pathname === '/app/validation') {
      getDownValidations()
      getTopValidations()
    }
    if (location.pathname === '/app/crypto') {
      getValidations({ page: 1 })
    }
  }

  function handleHold() {
    setInAsk(true)
    validationApi
      .holdValidation(selectedItem!.submission_id, selectedItem!.stage)
      .then(() => {
        message.success('Validation has been held for review')
        setOpen(false)
        props.onRefresh?.()
        closeResult()
      })
      .catch((err) => {
        message.error(err?.message)
      })
      .finally(() => setInAsk(false))
  }

  function handleResubmit() {
    setResult('')
    setSelectedItem(lastSubmitted?.validation || null)
    setInitialValue(lastSubmitted?.formValue)
    setOpen(true)
  }

  return (
    <div>
      <Drawer
        open={open}
        title={
          <>
            Details
            <Tooltip
              title={VALIDATION_TIPS.detail}
              className="ml-2 cursor-pointer"
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </>
        }
        width={600}
        onClose={() => {
          setOpen(false)
        }}
        closeIcon={null}
        afterOpenChange={(open) => {
          if (!open) {
            setValidation(undefined)
            setSelectedItem(null)
            setInitialValue(undefined)
          }
        }}
        rootClassName="[&>.ant-drawer-content-wrapper]:right-[400px]"
      >
        <ValidationDetail validation={validation!} />
      </Drawer>
      <Drawer
        title={
          <>
            <div className="flex items-center justify-between border-b border-b-[#babaff2b] px-6 py-4">
              <h2>Action</h2>
              <CloseOutlined
                onClick={() => {
                  setOpen(false)
                }}
              />
            </div>
            {!editable &&
              validation &&
              (selectedItem?.status === 'InProgress' ? (
                <div className="bg-[#00C39633] py-2 text-center text-sm font-normal text-[#008573]">
                  <InfoCircleOutlined size={12} className="mr-1" />
                  {['APPROVE', 'REJECT'].includes(
                    validation.decision?.decision || ''
                  )
                    ? 'You will receive the response within 48 hours.'
                    : 'Your reward will be issued at the end of the task.'}
                </div>
              ) : validation?.adopt ||
                ['UPVOTE', 'DOWNVOTE'].includes(
                  validation.decision?.decision || ''
                ) ? (
                <div className="bg-[#00C39633] py-2 text-center text-sm font-normal text-[#008573]">
                  <InfoCircleOutlined size={12} className="mr-1" />
                  Your reward has been issued.
                </div>
              ) : (
                <div className="bg-[#C300001A] py-2 text-center text-sm font-normal text-[#C30000]">
                  <InfoCircleOutlined size={12} className="mr-1" />
                  Your submission failed acceptance.
                </div>
              ))}
          </>
        }
        styles={{
          header: {
            border: 'none',
            padding: 0
          }
        }}
        destroyOnClose
        closeIcon={null}
        onClose={() => setOpen(false)}
        open={open}
        mask={false}
        width={400}
        footer={
          editable ? (
            <div className="flex items-center justify-end gap-5 px-2 py-4">
              {selectedItem?.status === 'NotStart' && (
                <Button
                  className="text-white [&>span]:hover:text-[#9a7ae8] [&>span]:hover:disabled:text-[#FFFFFF]/25"
                  type="link"
                  onClick={handleHold}
                  disabled={inCreation || !validation}
                  loading={inAsk}
                >
                  Accept the task
                </Button>
              )}
              <Button
                form="validation"
                type="primary"
                size="large"
                htmlType="submit"
                disabled={inAsk}
                loading={inCreation}
              >
                Submit
              </Button>
            </div>
          ) : null
        }
      >
        <Flex justify="space-between" vertical className="h-full">
          <ValidationAction
            onFinish={handleActionFinish}
            editable={editable}
            initialValue={initialValue}
          />
          {/* <Flex align="start" gap={4} className="text-#0400119C text-xs">
              <Info size={12} className="mt-2px flex-none" />
              The reason you provide will be automatically validated by AI(LLM-Claude3) models
            </Flex> */}
        </Flex>
      </Drawer>
      <Modal footer={null} open={!!result} onCancel={closeResult} width={456}>
        <div className="leading-5">
          {result === 'success' ? (
            <Result
              className="px-16 py-20"
              title="Submission Successful"
              subTitle={
                ['APPROVE', 'REJECT'].includes(
                  lastSubmitted?.formValue.decision || ''
                ) ? (
                  <div className="leading-5">
                    We have received your recommendation, and will share our
                    decision within approximately 48 hours
                  </div>
                ) : (
                  <div className="leading-5">
                    We have received your opinion, and you will receive less
                    reward at the end of the task
                  </div>
                )
              }
              status="success"
              extra={
                <Button type="primary" size="large" onClick={closeResult}>
                  Got it
                </Button>
              }
            />
          ) : (
            <Result
              className="p-[85px]"
              title="Verification failed"
              subTitle={result}
              status="error"
              extra={
                <Button type="primary" onClick={handleResubmit}>
                  Resubmit
                </Button>
              }
            />
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Index

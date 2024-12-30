import { useState, useEffect } from 'react'
import { Modal, Tabs, message, Result, Button } from 'antd'
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useSnapshot } from 'valtio'

import ViewInput from './input'
import Example from './example'

import validationApi, { TValidationDetail } from '@/api-v1/validation.api'
import { validationDetailStore, setSelectedItem, setOpen } from '@/stores/validation-details.store'
import {
  getTopValidations,
  getDownValidations,
  changeValidationFilter,
  validationFilterStore
} from '@/stores/validation-filter.store'
import { getValidations } from '@/stores/validation-notstart.store'

const Indec = () => {
  const {
    pageData: { page }
  } = useSnapshot(validationFilterStore)
  const { selectedItem, open } = useSnapshot(validationDetailStore)
  const [isExample, setIsExample] = useState(false)
  const [validation, setValidation] = useState<TValidationDetail>()
  const [decision, setDecision] = useState<string>('')
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    if (selectedItem) {
      validationApi
        .getValidationDetail(
          selectedItem.submission_id,
          selectedItem.task_type,
          selectedItem.current_stage || selectedItem.stage
        )
        .then(({ data }) => {
          setValidation(data)
        })
        .catch((err) => {
          console.log(err)
          message.error(err?.errorMessage ?? 'Something went wrong')
          setOpen(false)
          setSelectedItem(null)
        })
    }
  }, [selectedItem, setValidation])

  const handChange = (activeKey: string) => {
    setIsExample(activeKey === 'Example')
  }

  const handClose = () => {
    setIsExample(false)
    setValidation(undefined)
    setOpen(false)
    setSelectedItem(null)
  }

  const handleResubmit = () => {
    setResult('')
    // setSelectedItem(lastSubmitted?.validation)
    setOpen(true)
  }

  function closeResult() {
    setResult('')
    handClose()
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

  return (
    <>
      <Modal
        width={720}
        centered
        open={open}
        footer={false}
        closable={false}
        destroyOnClose
        maskClosable
        onCancel={handClose}
        className="[&_.ant-tabs-tab-btn]: text-gray-500 [&_.ant-modal-content]:p-0"
      >
        <div className="overflow-auto rounded-s-3xl">
          {validation &&
            !isExample &&
            !['NotStart', 'OnHold'].includes(selectedItem?.status || '') &&
            (selectedItem?.status === 'InProgress' ? (
              <div className="bg-[#00C39633] py-2 text-center text-sm font-normal text-[#008573]">
                <InfoCircleOutlined size={12} className="mr-1" />
                {['APPROVE', 'REJECT'].includes(validation.decision?.decision || '')
                  ? 'You will receive the response within 48 hours.'
                  : 'Your reward will be issued at the end of the task.'}
              </div>
            ) : validation?.adopt || ['UPVOTE', 'DOWNVOTE'].includes(validation.decision?.decision || '') ? (
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
        </div>
        <Tabs
          tabBarGutter={50}
          tabBarExtraContent={<CloseOutlined className="mr-4 text-white" onClick={handClose} />}
          defaultActiveKey={isExample ? 'Example' : 'Input'}
          onChange={handChange}
          items={[
            {
              key: '0',
              label: ''
            },
            {
              key: 'Input',
              label: 'Input',
              children: (
                <ViewInput
                  reload={closeResult}
                  validation={validation!}
                  setDecision={setDecision}
                  setResult={setResult}
                />
              )
            },
            {
              key: 'Example',
              label: 'Example',
              children: <Example type={selectedItem?.task_type || ''} />
            }
          ]}
        />
      </Modal>
      <Modal footer={null} open={!!result} onCancel={closeResult} width={456}>
        <div className="leading-5">
          {result === 'success' ? (
            <Result
              className="px-[60px] py-[72px]"
              title="Submission Successful"
              subTitle={
                ['APPROVE', 'REJECT'].includes(decision) ? (
                  <div className="leading-5">
                    We have received your recommendation, and will share our decision within approximately 48 hours
                  </div>
                ) : (
                  <div className="leading-5">
                    We have received your opinion, and you will receive less reward at the end of the task
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
    </>
  )
}

export default Indec

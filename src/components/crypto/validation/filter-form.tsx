import { useEffect, useState } from 'react'
import { Button, Form, Modal, Select, Space } from 'antd'
import { useSnapshot } from 'valtio'
import IconFilter from '@/assets/crypto/filter.svg'
import { useOptions } from '@/stores/config.store'
import {
  validationFilterStore,
  changeValidationFilter,
  TaskType,
  TValidationFilterStore
} from '@/stores/validation-filter.store'
import { setStage } from '@/stores/validation-notstart.store'

const FilterFormBox = () => {
  const [form] = Form.useForm()
  const {
    paramsData: { network, stage, task_type }
  } = useSnapshot(validationFilterStore)
  const [open, setOpen] = useState(false)
  const optionStore = useOptions()
  const isS3 = false

  const onCreate = (values: Partial<TValidationFilterStore['paramsData']>) => {
    console.log('values', values)
    changeValidationFilter({ paramsData: { ...values } })
    setOpen(false)
  }

  const startFilter = (
    inputValue: string,
    option: { label: string; value: string | number } | undefined
  ) => {
    if (!option) return false
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  }

  useEffect(() => {
    form.setFieldsValue({
      network,
      stage,
      task_type
    })
  }, [network, stage, task_type, form])

  useEffect(() => {
    setStage(stage)
  }, [stage])

  return (
    <>
      <Button
        block
        shape="round"
        style={{ height: 44 }}
        className="flex justify-between bg-inherit [&>span]:text-base"
        icon={<IconFilter size={14} />}
        iconPosition="end"
        onClick={() => setOpen(true)}
      >
        Filter
      </Button>
      <Modal
        open={open}
        title="Filter"
        footer={null}
        maskClosable
        onCancel={() => setOpen(false)}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="task_type"
          label="Type"
          initialValue={TaskType.SUBMISSION_ALL}
        >
          <Select
            options={[
              {
                label: 'Image from third party data?',
                value: 'SUBMISSION_PRIVATE'
              },
              {
                label: 'Address has historical transaction?',
                value: 'SUBMISSION_HASH_ADDRESS'
              },
              {
                label: 'Image or description related to the address?',
                value: 'SUBMISSION_IMAGE_ADDRESS'
              },
              {
                label: 'Image or description related to the entity?',
                value: 'SUBMISSION_IMAGE_ENTITY'
              },
              {
                label: 'All',
                value: 'SUBMISSION_ALL'
              }
            ]}
            showSearch
            filterOption={startFilter}
          />
        </Form.Item>
        <Form.Item name="network" label="Network" initialValue={''}>
          <Select
            options={[
              {
                label: 'All',
                value: ''
              },
              ...optionStore.networks
            ]}
            showSearch
            filterOption={startFilter}
          />
        </Form.Item>
        {isS3 && (
          <Form.Item label="Stage" name="stage" initialValue={2}>
            <Select
              options={[
                {
                  label: 'Stage2',
                  value: 2
                },
                {
                  label: 'Stage3',
                  value: 3
                }
              ]}
              showSearch
              filterOption={startFilter}
            />
          </Form.Item>
        )}
        <Form.Item>
          <div className="flex flex-row-reverse">
            <Space>
              <div className="h-11 w-[120px]">
                <Button
                  htmlType="reset"
                  type="link"
                  block
                  shape="round"
                  className="h-full text-white"
                >
                  Reset
                </Button>
              </div>

              <div className="h-11 w-[120px]">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  shape="round"
                  className="h-full"
                >
                  Apply
                </Button>
              </div>
            </Space>
          </div>
        </Form.Item>
      </Modal>
    </>
  )
}

export default FilterFormBox

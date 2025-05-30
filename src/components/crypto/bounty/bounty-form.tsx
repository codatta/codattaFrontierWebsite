import { AutoComplete, Button, Col, Flex, Form, FormInstance, Input, Row, Select, Tag, Tooltip, message } from 'antd'
import Cascader from '@/components/common/category-cascader'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Rule } from 'antd/es/form'
import { Info } from 'lucide-react'

import ImageUpload from '@/components/crypto/bounty/image-upload'
import bountyApi, { BountyType, TSubmitResult } from '@/api-v1/bounty.api'
import { debounce } from 'lodash'
import { getCategoryValueByChild, useOptions, useOptionsWithExtra } from '@/stores/config.store'
// import { useSnapshot } from 'valtio'
import configApi from '@/api-v1/config.api'

export interface BountyFormValues {
  address: string
  network: string
  entity: string
  category: string[]
  evidence_link: string
  evidence_text: string
  evidence_hash: string
  evidence_files: { src: string }[]
}

function RequireMask(label: ReactNode, info: { required: boolean }) {
  const { required } = info
  return (
    <>
      <span className="font-bold text-white">{label}</span>
      {required && <span className="ml-1 text-base text-gray-700">*</span>}
    </>
  )
}

export default function BountyForm(props: {
  taskId: string
  form: FormInstance
  type: BountyType
  initialValue?: Partial<BountyFormValues>
  onFinish: (values: TSubmitResult) => void
}) {
  const { form, type, initialValue, onFinish, taskId } = props
  const [recentEntity, setRecentEntity] = useState<string[]>([])
  const [recentCategory, setRecentCategory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const options = useOptions()
  const { networksWithIcon } = useOptionsWithExtra()

  useEffect(() => {
    bountyApi.getRecentEntity().then((data) => setRecentEntity(data))
    bountyApi.getRecentCategory().then((data) => setRecentCategory(data))
  }, [])

  const recheckAddress = debounce(() => {
    if (form.getFieldValue('address')) form.validateFields(['address'])
  }, 500)

  async function handleSubmit(formValue: BountyFormValues) {
    const evidence = {
      link: formValue.evidence_link,
      text: formValue.evidence_text,
      hash: formValue.evidence_hash,
      files: formValue.evidence_files,
      date: new Date().getTime()
    }

    const submitData = {
      address: formValue.address,
      network: formValue.network,
      entity: formValue.entity,
      source: 'ground-truth',
      evidence: JSON.stringify(evidence),
      category: formValue.category.map(([, v]) => v).join(',')
    }

    setLoading(true)
    try {
      const { data } = await bountyApi.submitBounty(type, taskId, submitData)
      onFinish(data)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  const addressRules: Rule[] = [{ required: true, message: 'Please input address' }]

  const handleEntityChange = useCallback(
    (v: string) => {
      configApi.getCategoryByEntity(v).then(({ data }) => {
        const preset = data.map(getCategoryValueByChild)
        form.setFieldValue('category', preset)
        if (data.length) {
          form.validateFields(['category'])
        }
      })
    },
    [form]
  )

  useEffect(() => {
    if (!initialValue?.entity) return
    handleEntityChange(initialValue.entity)
  }, [initialValue, handleEntityChange])

  function setCategory(category: string) {
    const currentValue = form.getFieldValue('category') as string[][]
    if (currentValue?.some(([, v]) => v === category)) return
    form.setFieldValue('category', [...(currentValue ?? []), getCategoryValueByChild(category)])
  }

  const entityFilter = (inputValue: string, option?: { label: string }) => {
    if (!option) return false
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  }
  const categoryFilter = (inputValue: string, [_, option]: { label: string }[]) => {
    if (!option) return false
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  }

  return (
    <Form
      initialValues={initialValue}
      form={form}
      requiredMark={RequireMask}
      layout="vertical"
      size="large"
      onFinish={handleSubmit}
    >
      {/* <Form.Item name="isExternal" noStyle={true}>
          <div className="gap-8px mb-3 flex items-center">
            <Checkbox></Checkbox>
            Data sourced from external platforms like blockchain explorers, social media, news?
          </div>
        </Form.Item> */}

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Network" name="network" rules={[{ required: true, message: 'Please select network' }]}>
            <Select
              showSearch
              disabled={type === BountyType.Entity}
              options={networksWithIcon}
              onChange={recheckAddress}
              placeholder="Select the network your address belongs to"
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label="Address" name="address" rules={addressRules}>
            <Input
              disabled={type === BountyType.Entity}
              placeholder="Ensure the submitted address matches your selected network"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Entity" name="entity" rules={[{ required: false, message: 'Please select entity' }]}>
        <AutoComplete
          disabled={type === BountyType.Address}
          allowClear
          backfill
          filterOption={entityFilter}
          options={options.entities as { label: string; value: string }[]}
          placeholder="Represent the address owner (company, institution, organization, etc.)."
          onChange={handleEntityChange}
        />
      </Form.Item>
      {!!recentEntity.length && type === BountyType.Entity && (
        <div className={`-mt-4 mb-4 flex flex-wrap items-center gap-y-1`}>
          <span className="mr-1">Recent:</span>
          {recentEntity.map((entity) => (
            <Tag
              key={entity}
              className="cursor-pointer bg-gray-200"
              onClick={() => {
                form.setFieldValue('entity', entity)
                form.validateFields(['entity'])
              }}
            >
              {entity}
            </Tag>
          ))}
        </div>
      )}

      <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select category' }]}>
        <Cascader
          size="large"
          options={options.categories}
          showSearch={{ filter: categoryFilter }}
          multiple
          expandTrigger="hover"
          onChange={recheckAddress}
          placeholder="Click the icon for helping choose"
        />
      </Form.Item>
      {!!recentCategory.length && (
        <div className={`-mt-4 mb-4 flex flex-wrap items-center gap-y-1`}>
          <span className="mr-1">Recent:</span>
          {recentCategory.map((category) => (
            <Tooltip title={category.length > 40 ? category : null} key={category}>
              <Tag
                className="cursor-pointer truncate bg-gray-200"
                onClick={() => {
                  category.split(',').forEach((v) => {
                    setCategory(v)
                  })
                  form.validateFields(['category'])
                  recheckAddress()
                }}
              >
                {category}
              </Tag>
            </Tooltip>
          ))}
        </div>
      )}

      <div className="pt-8 text-lg font-semibold">Evidence</div>
      <p className="mb-4 text-sm text-gray-700 text-opacity-45">
        The evidence you submit should support the data provided
      </p>
      <Form.Item
        label="TxHash"
        name="evidence_hash"
        rules={[{ required: true, message: 'Please provide txhash evidence' }]}
      >
        <Input placeholder="The TxHash should directly associated with the submitted address" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="evidence_text"
        rules={[{ required: true, message: 'Please provide text evidence' }]}
      >
        <Input.TextArea rows={4} placeholder="Provide a textual description to support your submitted data" />
      </Form.Item>

      <Form.Item
        label="Image"
        name="evidence_files"
        validateTrigger="onChange"
        rules={[{ required: true, type: 'array', message: 'Please provide image evidence' }]}
      >
        <ImageUpload onChange={(fileItems) => form.setFieldValue('evidence_files', fileItems)} />
      </Form.Item>

      <Form.Item label="Link" name="evidence_link" rules={[{ type: 'url', message: 'link is not a valid url' }]}>
        <Input placeholder="Include social media links, news updates, and similar resources" />
      </Form.Item>

      <Flex align="center" className="my-6 text-xs text-gray-600" justify="center" gap={4}>
        <Info size={12} />
        The data and evidence will be automatically validated by AI(LLM-Claude3) models
      </Flex>

      <Button loading={loading} shape="round" type="primary" htmlType="submit" className="m-auto block w-60">
        Submit
      </Button>
    </Form>
  )
}

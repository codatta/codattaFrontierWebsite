import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Pagination, Select, Spin } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { useSnapshot } from 'valtio'

import IconExplore from '@/assets/crypto/explore.svg'
import FilterFormBox from '@/components/crypto/validation/filter-form'
import CardList from '@/components/crypto/validation/card-list'
import Details from '@/components/crypto/validation/details-v2'
import OldDetails from '@/components/crypto/validation/details'

import arrowLeft from '@/assets/crypto/arrow-left.svg'

import {
  validationFilterStore,
  changeValidationFilter,
  resetFilterStore,
  TValidationFilterStore
} from '@/stores/validation-filter.store'

export default function Component() {
  const navigate = useNavigate()
  const {
    paramsData: { type, sort, status },
    pageData: { page, page_size, total, listLoading }
  } = useSnapshot(validationFilterStore)

  const [sorts, setSorts] = useState({
    pointSort: sort, // DESC
    dateSort: sort // DESC
  })

  const [address, setAddress] = useState('')
  const filterRef = useRef<HTMLDivElement>(null)
  const inProgress = useRef<HTMLDivElement>(null)

  // const isS3 = roles?.includes(Role.S3)

  const handlePageChange = (page: number) => {
    changeValidationFilter({ pageData: { page } })
  }

  const handleStatusChange = (status: string) => {
    changeValidationFilter({ paramsData: { status } })
  }

  const handleDateChange = (sortValue: { sort: 'DESC' | 'ASC'; type: 'Date' | 'Point' }) => {
    changeValidationFilter({ paramsData: sortValue })
  }

  const searchAddress = () => {
    changeValidationFilter({ paramsData: { address } })
  }

  useEffect(() => {
    const paramsData: Partial<TValidationFilterStore['paramsData']> = {
      status: 'InProgress',
      stage: 2,
      network: '',
      address: '',
      sort, // ASC
      type // Date
    }
    changeValidationFilter({ paramsData })
    return () => {
      resetFilterStore()
    }
  }, [sort, type])

  return (
    <div className="">
      <div className="mb-6 flex cursor-pointer text-2xl font-semibold leading-[32px]" onClick={() => navigate(-1)}>
        <img src={arrowLeft} alt="" className="mr-1" />
        <span>Validation</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <div ref={inProgress}>
          <Select
            defaultValue={status}
            style={{ width: 140, height: 44 }}
            className="[&>.ant-select-selector]:rounded-[48px]"
            onChange={handleStatusChange}
            options={[
              // { value: 'NotStart', label: 'Not Start' },
              { value: 'OnHold', label: 'On Hold' },
              { value: 'InProgress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
        </div>
        {/* <div className="flex gap-x-4"> */}
        <div className="w-28 md:flex-none">
          <Button
            block
            shape="round"
            className="flex justify-between bg-inherit [&>span]:text-base"
            style={{ height: 44 }}
            icon={sorts.pointSort === 'ASC' ? <CaretUpOutlined /> : <CaretDownOutlined />}
            iconPosition="end"
            onClick={() => {
              const _sort = sorts.pointSort === 'ASC' ? 'DESC' : 'ASC'
              setSorts({ ...sorts, pointSort: _sort })
              handleDateChange({ sort: _sort, type: 'Point' })
            }}
          >
            Point
          </Button>
        </div>
        <div className="w-28 md:flex-none">
          <Button
            block
            shape="round"
            style={{ height: 44 }}
            className="flex justify-between bg-inherit [&>span]:text-base"
            icon={sorts.dateSort === 'ASC' ? <CaretUpOutlined /> : <CaretDownOutlined />}
            iconPosition="end"
            onClick={() => {
              const _sort = sorts.dateSort === 'ASC' ? 'DESC' : 'ASC'
              setSorts({ ...sorts, dateSort: _sort })
              handleDateChange({ sort: _sort, type: 'Date' })
            }}
          >
            Date
          </Button>
        </div>
        <div className="w-28 md:flex-none" ref={filterRef}>
          <FilterFormBox />
        </div>
        <div className="flex h-11 w-[280px] items-center justify-between rounded-[40px] border border-gray-200 px-4 py-1 pl-1 hover:border-[#9a7ae8]">
          <Input
            autoFocus
            className="h-full border-0 border-inherit text-base focus:shadow-none"
            type="text"
            placeholder="Search for a specific address"
            onPressEnter={searchAddress}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="cursor-pointer text-[#606067] hover:text-primary" onClick={searchAddress}>
            <IconExplore size={24} />
          </div>
        </div>
        {/* </div> */}
      </div>
      <Spin spinning={listLoading}>
        <CardList />
        <div>
          <div className="mt-auto flex items-center">
            <span className="text-sm">Total {total}</span>
            <Pagination
              showSizeChanger={false}
              onChange={handlePageChange}
              className="ml-auto py-5"
              total={total}
              pageSize={page_size}
              current={page}
            ></Pagination>
          </div>
        </div>
      </Spin>

      <Details />
      <OldDetails />
    </div>
  )
}

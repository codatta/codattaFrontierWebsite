import React from 'react'
import { ArrowDown } from '@react-vant/icons'
import { Select as AntdSelect } from 'antd'
import { cn } from '@udecode/cn'

import MobileSelect, { SelectOption } from '@/components/mobile-ui/select'

interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  className?: string
  name?: string
}

// PC Select Component using antd
const PCSelect: React.FC<SelectProps> = ({ options, value, onChange, placeholder, className, name }) => {
  const onHandleChange = (value: string | number) => {
    console.log(onHandleChange, value)
    onChange?.(value)
  }

  return (
    <AntdSelect
      className={cn(`h-[48px] w-full rounded-lg leading-[46px] text-white [&>.ant-select-arrow]:text-lg`, className)}
      options={options}
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      suffixIcon={<ArrowDown />}
    />
  )
}

// Responsive Select Component
const ResponsiveSelect: React.FC<SelectProps & { isMobile: boolean }> = (props) => {
  return props.isMobile ? (
    <MobileSelect {...props} className="[&>div]:bg-[#252532] [&_svg]:text-white" />
  ) : (
    <PCSelect {...props} />
  )
}

export default ResponsiveSelect

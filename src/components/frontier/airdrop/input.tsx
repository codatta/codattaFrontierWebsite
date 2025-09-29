import React from 'react'
import { Input as AntdInput } from 'antd'
import { cn } from '@udecode/cn'

// Define common props for the input component
interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  maxLength?: number
  showCount?: boolean
}

// PC Input Component using antd
const PCInput: React.FC<InputProps> = ({ value, onChange, placeholder, className, maxLength, showCount }) => {
  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value.trimStart())
  }

  return (
    <AntdInput
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      showCount={showCount}
      className={cn('!w-full !rounded-lg !bg-none !px-4 !py-3 !text-white placeholder:!text-[#606067]', className)}
    />
  )
}

export default PCInput

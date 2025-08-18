import React from 'react'
import { Input as VantInput } from 'react-vant'
import { Input as AntdInput } from 'antd'
import { cn } from '@udecode/cn'

// Define common props for the input component
interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  isMobile: boolean
  maxLength?: number
}

// Mobile Input Component using react-vant
const MobileInput: React.FC<InputProps> = ({ value, onChange, placeholder, className, maxLength }) => {
  const onHandleChange = (str: string) => {
    const val = str.trimStart()

    console.log('onHandleChange', val)
    onChange?.(val)
  }
  return (
    <VantInput
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(
        'w-full rounded-[10px] bg-[#252532] px-4 py-3 text-base text-white [&>input]:text-white [&>input]:placeholder:text-[#77777D]',
        className
      )}
    />
  )
}

// PC Input Component using antd
const PCInput: React.FC<InputProps> = ({ value, onChange, placeholder, className, maxLength }) => {
  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trimStart()
    console.log('onHandleChange', val)
    onChange?.(val)
  }

  return (
    <AntdInput
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn('!w-full !rounded-lg !bg-none !px-4 !py-3 !text-white placeholder:!text-[#606067]', className)}
    />
  )
}

// Responsive Input Component
const ResponsiveInput: React.FC<InputProps & { isMobile: boolean }> = (props) => {
  return props.isMobile ? <MobileInput {...props} /> : <PCInput {...props} />
}

export default ResponsiveInput

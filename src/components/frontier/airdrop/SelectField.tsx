import { Select } from 'antd'
import { cn } from '@udecode/cn'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  options?: Option[]
}

export default function SelectField({ value, onChange, placeholder, className, options = [] }: SelectFieldProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      className={cn('!w-full', className)}
    />
  )
}

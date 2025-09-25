import { Input } from 'antd'
import { cn } from '@udecode/cn'

const { TextArea } = Input

interface TextFieldProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  maxLength?: number
  showCount?: boolean
}

export default function TextField({
  value,
  onChange,
  placeholder,
  className,
  rows = 2,
  maxLength,
  showCount
}: TextFieldProps) {
  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <TextArea
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      showCount={showCount}
      className={cn('!w-full !rounded-lg !bg-none !px-4 !py-3 !text-white placeholder:!text-[#606067]', className)}
    />
  )
}

import React, { useEffect, useState } from 'react'
import { AutoComplete, Input } from 'antd'

// const KEYWORDS: string[] = []

interface KeywordInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  onSearch?: (value: string) => void
  showCount?: boolean
  maxLength?: number
  autoComplete?: boolean
}
const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  showCount = true,
  autoComplete = true,
  maxLength = 200,
  placeholder
}) => {
  const [inputValue, setInputValue] = useState(value || '')

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const onSelect = (selectedValue: string) => {
    const val = value?.replace(/[^\s\n]+$/, '')
    const newValue = value ? `${val}${selectedValue}` : selectedValue
    onChange?.(newValue)
    console.log('onSelect', newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  // function onFilterOption(inputValue: string, option?: { value: string }) {
  //   const val = inputValue
  //     .split(/[\s,\n]+/)
  //     .slice(-1)[0]
  //     .trim()

  //   return option?.value?.toLowerCase().startsWith(val.toLowerCase())
  // }

  // const renderItem = (title: string) => ({
  //   value: title,
  //   label: <div className="flex items-center justify-between">{title}</div>
  // })

  // const options = KEYWORDS.map((item) => ({
  //   label: <div className="flex items-center justify-between">{item.type}</div>,
  //   options: item.keywords.sort().map(renderItem)
  // }))

  return autoComplete ? (
    <AutoComplete value={inputValue} onSelect={onSelect} onChange={onChange}>
      <Input.TextArea
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || 'Enter description'}
        autoSize={true}
        showCount={showCount}
        allowClear={true}
        maxLength={maxLength}
        variant="filled"
      />
    </AutoComplete>
  ) : (
    <Input.TextArea
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder || 'Enter description'}
      autoSize={true}
      showCount={showCount}
      allowClear={true}
      maxLength={maxLength}
      variant="filled"
    />
  )
}

export default KeywordInput

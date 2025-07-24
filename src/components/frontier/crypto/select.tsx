import React from 'react'
// import { Picker, Popup } from 'react-vant'
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
}

// Mobile Select Component using react-vant
// const MobileSelect: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select', className }) => {
//   const [visible, setVisible] = useState(false)
//   const [selectedText, setSelectedText] = useState('')
//   const [selectedValue, setSelectedValue] = useState(value)

//   const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value])

//   const handleConfirm = (val: string | number) => {
//     console.log(handleConfirm, val)
//     onChange?.(val)
//     setVisible(false)
//   }

//   const handleCancel = () => {
//     setVisible(false)
//     setSelectedValue(value)
//   }

//   const handleValueChange = (val: string | number) => {
//     console.log(handleValueChange, val)
//     setSelectedValue(val)
//   }

//   useEffect(() => {
//     console.log(value)
//     setSelectedText(options.find((option) => option.value === value)?.text || '')
//     setSelectedValue(value)
//   }, [value, options])

//   return (
//     <>
//       <div
//         className={cn(
//           'flex cursor-pointer select-none items-center justify-between rounded-[10px] bg-[#252532] px-4 py-3 text-base text-white transition-colors duration-300 hover:bg-[#4a4a5a]',
//           className
//         )}
//         onClick={() => setVisible(true)}
//       >
//         <span className={selectedOption ? 'text-white' : 'text-[#77777D]'}>{selectedText || placeholder}</span>
//         <ArrowDown />
//       </div>
//       <Popup visible={visible} round position="top" onClose={handleCancel}>
//         <Picker
//           title={placeholder}
//           columns={options}
//           value={selectedValue?.toString()}
//           onConfirm={handleConfirm}
//           onCancel={handleCancel}
//           onChange={handleValueChange}
//           className="text-base"
//         />
//       </Popup>
//     </>
//   )
// }

// PC Select Component using antd
const PCSelect: React.FC<SelectProps> = ({ options, value, onChange, placeholder, className }) => {
  const onHandleChange = (value: string | number) => {
    console.log(onHandleChange, value)
    onChange?.(value)
  }

  return (
    <AntdSelect
      className={cn(
        `h-[48px] w-full rounded-lg border border-[#FFFFFF1F] leading-[46px] text-white [&>.ant-select-arrow>.rv-icon]:!text-[#606067] [&>.ant-select-arrow]:text-lg`,
        className
      )}
      options={options}
      value={value}
      onChange={onHandleChange}
      placeholder={placeholder}
      suffixIcon={<ArrowDown className="text-white" />}
    />
  )
}

// Responsive Select Component
const ResponsiveSelect: React.FC<SelectProps & { isMobile: boolean }> = (props) => {
  return props.isMobile ? <MobileSelect {...props} className="[&>div]:bg-[#252532]" /> : <PCSelect {...props} />
}

export default ResponsiveSelect

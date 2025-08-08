import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search, X } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface DarkSelectProps {
  options: SelectOption[]
  value?: string | number
  placeholder?: string
  disabled?: boolean
  className?: string
  onChange?: (value: string | number, option: SelectOption) => void
  onClose?: () => void
  title?: string
  confirmText?: string
  cancelText?: string
  searchable?: boolean
  searchPlaceholder?: string
  height?: string | number
}

const DarkSelect: React.FC<DarkSelectProps> = ({
  options = [],
  value,
  placeholder = 'Select',
  disabled = false,
  className = '',
  onChange,
  onClose,
  title = 'Select',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  searchable = false,
  searchPlaceholder = 'Search...',
  height = '80vh'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value)
  const [tempValue, setTempValue] = useState<string | number | undefined>(value)
  const [searchText, setSearchText] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options)

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSelectedValue(value)
    setTempValue(value)
  }, [value])

  useEffect(() => {
    setFilteredOptions(options)
  }, [options])

  useEffect(() => {
    if (!searchable || !searchText.trim()) {
      setFilteredOptions(options)
      return
    }

    const filtered = options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()))
    setFilteredOptions(filtered)
  }, [searchText, options, searchable])

  const placeholderText = <span className="text-white/40">{placeholder}</span>

  const getDisplayText = () => {
    if (selectedValue === undefined || selectedValue === null || selectedValue === '') {
      return placeholderText
    }
    const selectedOption = options.find((option) => option.value === selectedValue)
    return selectedOption?.label || placeholderText
  }

  const handleOpen = () => {
    if (!disabled) {
      setTempValue(selectedValue)
      setSearchText('')
      setIsOpen(true)
      // if (searchable) {
      //   setTimeout(() => {
      //     searchInputRef.current?.focus()
      //   }, 300)
      // }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTempValue(selectedValue)
    setSearchText('')
    onClose?.()
  }

  const clearSearch = () => {
    setSearchText('')
    searchInputRef.current?.focus()
  }

  const handleOptionSelect = (optionValue: string | number) => {
    setTempValue(optionValue)
  }

  const handleConfirm = () => {
    if (tempValue !== undefined) {
      setSelectedValue(tempValue)
      const selectedOption = options.find((option) => option.value === tempValue)
      if (selectedOption) {
        onChange?.(tempValue, selectedOption)
      }
    }
    setIsOpen(false)
    setSearchText('')
  }

  const handleCancel = () => {
    setTempValue(selectedValue)
    setIsOpen(false)
    setSearchText('')
    onClose?.()
  }

  return (
    <>
      <div className={`relative w-full ${className}`}>
        <div
          onClick={handleOpen}
          className={`flex w-full items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-white transition-colors ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-white/5'
          } ${!selectedValue ? 'text-gray-400' : 'text-white'} `}
        >
          <span className="flex-1 truncate text-left">{getDisplayText()}</span>
          <ChevronDown
            className={`size-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${disabled ? 'opacity-50' : ''}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black bg-opacity-70"
              onClick={handleClose}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              className="relative w-full max-w-md bg-[#1c1c26] text-white"
              style={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#1c1c26]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-6">
                  <button
                    onClick={handleCancel}
                    className="text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    {cancelText}
                  </button>
                  <h3 className="text-lg font-medium text-white">{title}</h3>
                  <button
                    onClick={handleConfirm}
                    className="text-sm font-medium text-primary/80 transition-colors hover:text-primary"
                  >
                    {confirmText}
                  </button>
                </div>

                {searchable && (
                  <div className="border-b border-white/5 p-4">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="size-4 text-gray-400" />
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-lg border border-white/10 bg-transparent px-10 py-3 text-sm text-white transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none"
                      />
                      {searchText && (
                        <button
                          onClick={clearSearch}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-300"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="overflow-y-auto"
                style={{
                  height: searchable
                    ? `calc(${typeof height === 'number' ? `${height}px` : height} - 80px)`
                    : `calc(${typeof height === 'number' ? `${height}px` : height} - 0px)`
                }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-gray-500">
                    {searchable && searchText ? 'No matching results' : 'No Options'}
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        disabled={option.disabled}
                        className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                          option.disabled ? 'cursor-not-allowed text-gray-600' : 'hover:bg-white/5 active:bg-primary/10'
                        } ${tempValue === option.value ? 'bg-primary/10 text-primary' : 'text-white'} `}
                      >
                        <span className="flex-1 text-wrap">{option.label}</span>
                        {tempValue === option.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                            <Check className="ml-2 size-5 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DarkSelect

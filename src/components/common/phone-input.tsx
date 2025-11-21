import React from 'react'
import { Select, Input } from 'antd'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  defaultCountry?: string
  placeholder?: string
  disabled?: boolean
}

const PhoneInputComponent: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  defaultCountry = 'CN',
  placeholder = 'Please enter your mobile number',
  disabled = false
}) => {
  // Parse the value to extract country code and phone number
  const parsePhoneValue = (phoneValue: string) => {
    if (!phoneValue) return { countryCode: defaultCountry, phoneNumber: '' }

    // Try to match international format
    const match = phoneValue.match(/^\+(\d+)\s*(.*)$/)
    if (match) {
      const dialCode = match[1]
      const number = match[2]

      // Find country by dial code
      const countries = getCountries()
      const country = countries.find((c) => {
        try {
          return getCountryCallingCode(c) === dialCode
        } catch {
          return false
        }
      })

      return {
        countryCode: country || defaultCountry,
        phoneNumber: number
      }
    }

    return { countryCode: defaultCountry, phoneNumber: phoneValue }
  }

  const { countryCode, phoneNumber } = parsePhoneValue(value)

  // Get all countries with their calling codes and sort alphabetically
  const countryOptions = getCountries()
    .map((country) => {
      const callingCode = getCountryCallingCode(country)
      const countryName = en[country] || country

      return {
        label: `${countryName} +${callingCode}`,
        value: country,
        searchLabel: `${countryName} ${country} +${callingCode}`,
        sortName: countryName
      }
    })
    .sort((a, b) => a.sortName.localeCompare(b.sortName))

  const handleCountryChange = (newCountry: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialCode = getCountryCallingCode(newCountry as any)
    const newValue = phoneNumber ? `+${dialCode} ${phoneNumber}` : `+${dialCode}`
    onChange?.(newValue)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialCode = getCountryCallingCode(countryCode as any)
    const newValue = newPhoneNumber ? `+${dialCode} ${newPhoneNumber}` : ''
    onChange?.(newValue)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentDialCode = getCountryCallingCode(countryCode as any)

  return (
    <div className="flex gap-2">
      <Select
        value={countryCode}
        onChange={handleCountryChange}
        disabled={disabled}
        showSearch
        optionFilterProp="searchLabel"
        className="h-12 w-[200px]"
        placeholder="Select Region"
        options={countryOptions}
        filterOption={(input, option) => (option?.searchLabel ?? '').toLowerCase().includes(input.toLowerCase())}
      />
      <Input
        value={phoneNumber}
        onChange={handlePhoneChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12 flex-1"
        prefix={<span className="text-gray-400">+{currentDialCode}</span>}
      />
    </div>
  )
}

export default PhoneInputComponent

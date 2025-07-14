import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { message } from 'antd'
import axios from 'axios'
import { CountryIndex, CountryDetail, State, LocationValue } from '../../types/common'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

interface MobileLocationPickerProps {
  value?: LocationValue
  onChange?: (value: LocationValue) => void
  placeholder?: string
  className?: string
  apiBaseUrl?: string // Configurable API base URL
}

const MobileLocationPicker: React.FC<MobileLocationPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select Location',
  className = '',
  apiBaseUrl = 'https://static.codatta.io/location' // Default API address
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState<LocationValue>(value || {})
  const [countries, setCountries] = useState<CountryIndex[]>([])
  const [countryDetail, setCountryDetail] = useState<CountryDetail>()
  const [provinces, setProvinces] = useState<State | undefined>()
  const isMobile = useIsMobile()

  const [loading, setLoading] = useState({
    countries: false,
    provinces: false,
    cities: false
  })

  const cities = useMemo(() => {
    return provinces?.cities || []
  }, [provinces])

  const states = useMemo(() => {
    const statesSet = new Set<string>()
    countryDetail?.states?.forEach((state) => {
      statesSet.add(state.name)
    })
    return Array.from(statesSet)
  }, [countryDetail])

  // API calls with improved error handling
  const fetchCountries = async () => {
    setLoading((prev) => ({ ...prev, countries: true }))
    try {
      const response = await axios.get(`${apiBaseUrl}/index.json`)
      setCountries(response.data as CountryIndex[])
    } catch (error) {
      console.error('Failed to fetch countries:', error)
      message.error('Failed to load countries. Please try again.')
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }))
    }
  }

  const fetchCountryDetail = async (countryIso3Code: string) => {
    setLoading((prev) => ({ ...prev, provinces: true }))
    try {
      const response = await axios.get(`${apiBaseUrl}/${countryIso3Code}.json`)
      setCountryDetail(response.data as CountryDetail)
    } catch (error) {
      console.error('Failed to fetch country detail:', error)
      message.error('Failed to load provinces. Please try again.')
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
  }

  // Reload selected country and province data
  const reloadSelectedData = async (selectedValue: LocationValue) => {
    if (selectedValue.country) {
      await fetchCountryDetail(selectedValue.country)

      // If a province is selected, need to wait for country details to load before setting province
      setTimeout(() => {
        if (selectedValue.province && countryDetail?.states) {
          const selectedState = countryDetail.states.find((s) => s.name === selectedValue.province)
          if (selectedState) {
            setProvinces(selectedState)
          }
        }
      }, 100)
    }
  }

  // Load countries data immediately when component mounts
  useEffect(() => {
    fetchCountries()
  }, [apiBaseUrl])

  // Reset province data when countryDetail updates
  useEffect(() => {
    if (countryDetail && tempValue.province) {
      const selectedState = countryDetail.states?.find((s) => s.name === tempValue.province)
      if (selectedState) {
        setProvinces(selectedState)
      }
    }
  }, [countryDetail, tempValue.province])

  const formatDisplayValue = useMemo(() => {
    if (!value || (!value.country && !value.province && !value.city)) {
      return placeholder
    }

    const parts = []
    if (value.country) {
      const country = countries.find((c) => c.iso3 === value.country)
      parts.push(country?.name || value.country)
    }
    if (value.province) {
      parts.push(value.province)
    }
    if (value.city) {
      parts.push(value.city)
    }

    const result = parts.join(', ') || placeholder
    console.log('formatDisplayValue result:', result)
    return result
  }, [value, countries, placeholder])

  const handleCountryChange = async (countryIso3Code: string) => {
    // Clear previous data
    setCountryDetail(undefined)
    setProvinces(undefined)

    setTempValue({
      country: countryIso3Code,
      province: undefined,
      city: undefined
    })

    if (countryIso3Code) {
      await fetchCountryDetail(countryIso3Code)
    }
  }

  const handleProvinceChange = (provinceCode: string) => {
    // Clear previous city data
    setProvinces(undefined)

    setTempValue((prev) => ({
      ...prev,
      province: provinceCode,
      city: undefined
    }))

    if (provinceCode && countryDetail?.states) {
      const selectedState = countryDetail.states.find((s) => s.name === provinceCode)
      if (selectedState) {
        setProvinces(selectedState)
      }
    }
  }

  const handleCityChange = (cityCode: string) => {
    setTempValue((prev) => ({
      ...prev,
      city: cityCode
    }))
  }

  const handleConfirm = () => {
    if (!tempValue.country) {
      message.error('Please select a country')
      return false
    }
    if (!tempValue.province) {
      message.error('Please select a province/state')
      return false
    }
    if (!tempValue.city) {
      message.error('Please select a city')
      return false
    }
    onChange?.(tempValue)
    setIsOpen(false)
    return true
  }

  const handleCancel = () => {
    setTempValue(value || {})
    // Reset to original state
    if (value?.country) {
      reloadSelectedData(value)
    } else {
      setCountryDetail(undefined)
      setProvinces(undefined)
    }
    setIsOpen(false)
  }

  const handleOpen = () => {
    const currentValue = value || {}
    setTempValue(currentValue)

    // Clear previous state
    setCountryDetail(undefined)
    setProvinces(undefined)

    // If there are selected values, reload corresponding data
    if (currentValue.country) {
      reloadSelectedData(currentValue)
    }

    setIsOpen(true)
  }

  const getAnimationProps = () => {
    if (isMobile) {
      return {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' }
      }
    } else {
      return {
        initial: { opacity: 0, scale: 0.95, y: 0 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 0 }
      }
    }
  }

  return (
    <>
      <div className={`relative w-full ${className}`}>
        <div
          onClick={handleOpen}
          className="flex h-[40px] w-full cursor-pointer items-center justify-between rounded-lg border border-white/15 px-4 text-white transition-colors hover:bg-white/10"
        >
          <span
            className={`flex-1 truncate text-left ${
              !value || (!value.country && !value.province && !value.city) ? 'text-gray-400' : 'text-white'
            }`}
          >
            {formatDisplayValue}
          </span>
          <ChevronDown className="size-5 text-gray-400 transition-transform" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black bg-opacity-70"
              onClick={handleCancel}
            />

            <motion.div
              {...getAnimationProps()}
              transition={
                isMobile
                  ? {
                      type: 'spring',
                      damping: 25,
                      stiffness: 300,
                      duration: 0.3
                    }
                  : {
                      type: 'tween',
                      ease: [0.25, 0.1, 0.25, 1],
                      duration: 0.2
                    }
              }
              className="relative w-full max-w-md rounded-t-2xl bg-[#1c1c26] text-white md:max-w-lg md:rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 rounded-t-2xl bg-[#1c1c26]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-6">
                  <div
                    onClick={handleCancel}
                    className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    Cancel
                  </div>
                  <h3 className="text-lg font-medium text-white">Select Location</h3>
                  <div
                    onClick={handleConfirm}
                    className="cursor-pointer text-sm font-medium text-primary/80 transition-colors hover:text-primary"
                  >
                    Confirm
                  </div>
                </div>
              </div>

              {/* Location Picker */}
              <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                {/* Country Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={tempValue.country || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleCountryChange(e.target.value)
                    }}
                    disabled={loading.countries}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="" className="bg-[#1c1c26]">
                      {loading.countries ? 'Loading...' : 'Select Country'}
                    </option>
                    {countries.map((country) => (
                      <option key={country.iso3} value={country.iso3} className="bg-[#1c1c26]">
                        {country.emoji} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Province Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">Province/State</label>
                  <select
                    value={tempValue.province || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleProvinceChange(e.target.value)
                    }}
                    disabled={loading.provinces || !countryDetail}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="" className="bg-[#1c1c26]">
                      {loading.provinces
                        ? 'Loading...'
                        : !countryDetail
                          ? 'No provinces available'
                          : 'Select Province/State'}
                    </option>
                    {states?.map((state) => (
                      <option key={state} value={state} className="bg-[#1c1c26]">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">City</label>
                  <select
                    value={tempValue.city || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={loading.cities || cities.length === 0}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="" className="bg-[#1c1c26]">
                      {loading.cities ? 'Loading...' : cities.length === 0 ? 'No cities available' : 'Select City'}
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-[#1c1c26]">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selection Preview */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 text-xs text-gray-400">Selected Location</div>
                  <div className="text-sm font-medium text-white">
                    {[
                      tempValue.country && countries.find((c) => c.iso3 === tempValue.country)?.name,
                      tempValue.province,
                      tempValue.city
                    ]
                      .filter(Boolean)
                      .join(', ') || 'None selected'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileLocationPicker

import React, { useState, useEffect, useMemo } from 'react'
import { message } from 'antd'
import axios from 'axios'
import { Plus, ChevronsUpDown } from 'lucide-react'

interface LocationValue {
  country?: string
  province?: string
  city?: string
}

interface CountryIndex {
  iso3: string
  name: string
  emoji: string
}

interface State {
  name: string
  cities: string[]
}

interface CountryDetail {
  states: State[]
}

interface LocationPickerProps {
  value?: LocationValue
  onChange?: (value: LocationValue) => void
  placeholder?: string
  apiBaseUrl?: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select',
  apiBaseUrl = 'https://static.codatta.io/location'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState<LocationValue>(value || {})
  const [countries, setCountries] = useState<CountryIndex[]>([])
  const [countryDetail, setCountryDetail] = useState<CountryDetail>()
  const [provinces, setProvinces] = useState<State | undefined>()

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

  // API calls
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

  // Reload selected data
  const reloadSelectedData = async (selectedValue: LocationValue) => {
    if (selectedValue.country) {
      await fetchCountryDetail(selectedValue.country)

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

  // Load countries on mount
  useEffect(() => {
    fetchCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (value.city) parts.push(value.city)
    if (value.province) parts.push(value.province)
    if (value.country) {
      const country = countries.find((c) => c.iso3 === value.country)
      if (country) parts.push(country.name)
    }

    return parts.join(', ') || placeholder
  }, [value, countries, placeholder])

  const handleCountryChange = async (countryIso3Code: string) => {
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
      return
    }
    if (!tempValue.province) {
      message.error('Please select a state')
      return
    }
    if (!tempValue.city) {
      message.error('Please select a city')
      return
    }
    onChange?.(tempValue)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempValue(value || {})
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

    setCountryDetail(undefined)
    setProvinces(undefined)

    if (currentValue.country) {
      reloadSelectedData(currentValue)
    }

    setIsOpen(true)
  }

  return (
    <div className="relative">
      {/* Input Display */}
      <button
        type="button"
        onClick={handleOpen}
        className="max-w-[200px] truncate text-right text-[17px] outline-none"
        style={{ color: value?.country ? '#999' : '#3C3C434D' }}
      >
        {formatDisplayValue}
      </button>

      {/* Location Picker Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 animate-fade-in bg-black/20" onClick={handleCancel} />

          {/* Picker */}
          <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 animate-scale-in rounded-3xl bg-[#F8F8F8] p-5 [animation-fill-mode:both]">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[18px] font-bold text-gray-400">Select Location</div>
              <button
                type="button"
                onClick={handleCancel}
                className="flex size-10 items-center justify-center rounded-full bg-white transition-all hover:bg-gray-100"
              >
                <Plus size={24} className="rotate-45 text-gray-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="mb-5 space-y-3">
              {/* Country Selection */}
              <div className="rounded-[20px] bg-white px-4 py-3">
                <div className="relative flex items-center justify-end">
                  <span className="text-[16px] text-black">Country</span>

                  <select
                    value={tempValue.country || ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={loading.countries}
                    className="w-full appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                  >
                    <option value="" disabled>
                      {loading.countries ? 'Loading...' : 'Select'}
                    </option>
                    {countries.map((country) => (
                      <option key={country.iso3} value={country.iso3}>
                        {country.emoji} {country.name}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                </div>
              </div>

              {/* Province Selection */}
              <div className="rounded-[20px] bg-white px-4 py-3">
                <div className="relative flex items-center justify-between">
                  <span className="text-[16px] text-black">State</span>
                  <select
                    value={tempValue.province || ''}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    disabled={loading.provinces || !countryDetail}
                    className="appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                  >
                    <option value="" disabled>
                      {loading.provinces ? 'Loading...' : !countryDetail ? 'Select country first' : 'Select'}
                    </option>
                    {states?.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                </div>
              </div>

              {/* City Selection */}
              <div className="rounded-[20px] bg-white px-4 py-3">
                <div className="relative flex items-center justify-end">
                  <span className="text-[16px] text-black">City</span>
                  <select
                    value={tempValue.city || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={loading.cities || cities.length === 0}
                    className="w-full appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                  >
                    <option value="" disabled>
                      {loading.cities ? 'Loading...' : cities.length === 0 ? 'Select state first' : 'Select'}
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-2xl bg-white py-3 text-[16px] font-semibold text-gray-500 transition-all hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="shadow-lg flex-1 rounded-2xl bg-[#40E1EF] py-3 text-[16px] font-semibold text-white shadow-[#40E1EF]/30 transition-all hover:bg-[#35c5d3]"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LocationPicker

import { Select, Input } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

import TrashIcon from '@/assets/userinfo/trash-icon.svg?react'

export interface MultiSelectRow {
  id: number
  isOther: boolean
  value: string
  isHistorical: boolean
  error?: string
}

interface MultiSelectListProps {
  rows: MultiSelectRow[]
  onChange: (rows: MultiSelectRow[]) => void
  options: { label: string; value: string }[]
  placeholder?: string
  otherInputPlaceholder?: string
  /** Append an "Other" option that switches the row to free-text input */
  showOther?: boolean
  /** Maximum number of rows allowed */
  max?: number
  /** When true, all rows are displayed as locked read-only fields (no add / delete) */
  allLocked?: boolean
}

function LockedRow({ value }: { value: string }) {
  return (
    <div className="flex h-[48px] flex-1 items-center rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.12)] px-4">
      <span className="text-sm text-white">{value}</span>
    </div>
  )
}

export function MultiSelectList({
  rows,
  onChange,
  options,
  placeholder = 'Select an option',
  otherInputPlaceholder = 'Enter value',
  showOther = false,
  max,
  allLocked = false
}: MultiSelectListProps) {
  const selectOptions = showOther ? [...options, { label: 'Other', value: 'other' }] : options

  function getLabel(value: string) {
    return options.find((o) => o.value === value)?.label || value
  }

  // Get all selected values (excluding current row)
  function getSelectedValues(excludeIndex: number): string[] {
    return rows
      .filter((_, i) => i !== excludeIndex)
      .map((r) => r.value)
      .filter(Boolean)
  }

  // Get all selected values in lowercase (for case-insensitive comparison)
  function getSelectedValuesLowerCase(excludeIndex: number): string[] {
    return getSelectedValues(excludeIndex).map((v) => v.toLowerCase())
  }

  // Get all "Other" input values (excluding current row, normalized)
  function getOtherInputValues(excludeIndex: number): string[] {
    return rows
      .filter((r, i) => i !== excludeIndex && r.isOther && r.value)
      .map((r) => r.value.replace(/\s+/g, '').toLowerCase())
  }

  // Get all option values (for checking if "Other" input matches an option)
  function getAllOptionValues(): string[] {
    return options.map((o) => o.value.replace(/\s+/g, '').toLowerCase())
  }

  // Validate "Other" input
  function validateOtherInput(value: string, rowIndex: number): string | undefined {
    const trimmed = value.trim()
    if (!trimmed) {
      return 'This field cannot be empty'
    }

    const normalized = trimmed.replace(/\s+/g, '').toLowerCase()

    // Check if matches any option
    const optionValues = getAllOptionValues()
    if (optionValues.includes(normalized)) {
      return 'This value matches an existing option'
    }

    // Check if duplicates with other "Other" inputs
    const otherInputs = getOtherInputValues(rowIndex)
    if (otherInputs.includes(normalized)) {
      return 'This value is already used'
    }

    return undefined
  }

  // Get available options for a specific row (excluding already selected)
  function getAvailableOptions(rowIndex: number) {
    const selectedValuesLower = getSelectedValuesLowerCase(rowIndex)
    return selectOptions.filter(
      (opt) => opt.value === 'other' || !selectedValuesLower.includes(opt.value.toLowerCase())
    )
  }

  function updateRow(index: number, updates: Partial<MultiSelectRow>) {
    const next = [...rows]
    next[index] = { ...next[index], ...updates }

    // Validate "Other" input if it's an "Other" row
    if (next[index].isOther && next[index].value !== undefined) {
      const error = validateOtherInput(next[index].value, index)
      next[index] = { ...next[index], error }
    } else {
      // Clear error for non-"Other" rows
      next[index] = { ...next[index], error: undefined }
    }

    onChange(next)
  }

  function deleteRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  function addRow() {
    onChange([...rows, { id: Date.now(), isOther: false, value: '', isHistorical: false }])
  }

  const canAdd = !allLocked && (max === undefined || rows.length < max)

  if (allLocked) {
    return (
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <LockedRow key={row.id ?? i} value={getLabel(row.value)} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={row.id} className="flex items-start gap-2">
          {row.isHistorical ? (
            <div className="flex-1">
              <LockedRow value={getLabel(row.value)} />
            </div>
          ) : row.isOther ? (
            <>
              {/* Fixed-width "Other" selector, can switch back to other options */}
              <div className="w-[240px]">
                <Select
                  showSearch
                  optionFilterProp="label"
                  className="h-[48px] w-full"
                  value="other"
                  options={getAvailableOptions(i)}
                  onChange={(val) => {
                    if (val === 'other') {
                      // Stay in "Other" mode, just clear the input
                      updateRow(i, { isOther: true, value: '' })
                    } else {
                      // Switch back to normal select mode
                      updateRow(i, { isOther: false, value: val })
                    }
                  }}
                  suffixIcon={<DownOutlined className="text-white" />}
                />
              </div>
              {/* Free-text input */}
              <div className="flex-1">
                <div
                  className={cn(
                    'flex h-[48px] items-center rounded-lg border px-4',
                    row.error ? 'border-red-500' : 'border-[rgba(255,255,255,0.12)]'
                  )}
                >
                  <Input
                    placeholder={otherInputPlaceholder}
                    variant="borderless"
                    className="!bg-transparent !p-0 !text-white placeholder:!text-[#606067]"
                    value={row.value}
                    onChange={(e) => updateRow(i, { value: e.target.value })}
                  />
                </div>
                {row.error && <p className="mt-1 text-xs text-red-500">{row.error}</p>}
              </div>
            </>
          ) : (
            <div className="flex-1">
              <Select
                showSearch
                optionFilterProp="label"
                className="h-[48px] w-full"
                placeholder={placeholder}
                value={row.value || undefined}
                options={getAvailableOptions(i)}
                onChange={(val) => {
                  if (val === 'other') {
                    updateRow(i, { isOther: true, value: '' })
                  } else {
                    updateRow(i, { value: val })
                  }
                }}
                suffixIcon={<DownOutlined className="text-white" />}
              />
            </div>
          )}

          {/* Delete button: only on non-historical rows, keep at least 1 row */}
          {!row.isHistorical && rows.length > 1 && (
            <button
              className="flex h-[48px] shrink-0 items-center justify-center text-[#606067] hover:text-white"
              onClick={() => deleteRow(i)}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      ))}

      {canAdd && (
        <button onClick={addRow} className="flex items-center gap-2 text-sm text-white">
          <PlusOutlined className="text-xs" />
          <span>Add</span>
        </button>
      )}
    </div>
  )
}

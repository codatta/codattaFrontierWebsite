import { Select, Input } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'

import TrashIcon from '@/assets/userinfo/trash-icon.svg?react'

export interface MultiSelectRow {
  id: number
  isOther: boolean
  value: string
  isHistorical: boolean
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

  function updateRow(index: number, updates: Partial<MultiSelectRow>) {
    const next = [...rows]
    next[index] = { ...next[index], ...updates }
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
        <div key={row.id} className="flex items-center gap-2">
          {row.isHistorical ? (
            <div className="flex-1">
              <LockedRow value={getLabel(row.value)} />
            </div>
          ) : row.isOther ? (
            <>
              {/* Fixed-width "Other" selector, click to switch back */}
              <div className="w-[240px]">
                <Select
                  className="h-[48px] w-full"
                  value="other"
                  options={[{ label: 'Other', value: 'other' }]}
                  onChange={() => updateRow(i, { isOther: false, value: '' })}
                  suffixIcon={<DownOutlined className="text-white" />}
                />
              </div>
              {/* Free-text input */}
              <div className="flex h-[48px] flex-1 items-center rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                <Input
                  placeholder={otherInputPlaceholder}
                  variant="borderless"
                  className="!bg-transparent !p-0 !text-white placeholder:!text-[#606067]"
                  value={row.value}
                  onChange={(e) => updateRow(i, { value: e.target.value })}
                />
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
                options={selectOptions}
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
              className="flex shrink-0 items-center justify-center text-[#606067] hover:text-white"
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

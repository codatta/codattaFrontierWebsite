import { cn } from '@udecode/cn'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

export default function Checkbox({ checked, onChange, className, disabled = false }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'flex shrink-0 items-center justify-center',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      aria-checked={checked}
      role="checkbox"
    >
      {checked ? <CheckedIcon /> : <UncheckedIcon />}
    </button>
  )
}

function UncheckedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.6">
        <g style={{ mixBlendMode: 'multiply' }}>
          <path
            d="M3 2.25H15C15.4142 2.25 15.75 2.58579 15.75 3V15C15.75 15.4142 15.4142 15.75 15 15.75H3C2.58579 15.75 2.25 15.4142 2.25 15V3C2.25 2.58579 2.58579 2.25 3 2.25ZM3.75 3.75V14.25H14.25V3.75H3.75Z"
            fill="#999999"
          />
        </g>
      </g>
    </svg>
  )
}

function CheckedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.6">
        <g style={{ mixBlendMode: 'multiply' }}>
          <path
            d="M3 2.25H15C15.4142 2.25 15.75 2.58579 15.75 3V15C15.75 15.4142 15.4142 15.75 15 15.75H3C2.58579 15.75 2.25 15.4142 2.25 15V3C2.25 2.58579 2.58579 2.25 3 2.25ZM3.75 3.75V14.25H14.25V3.75H3.75ZM8.25195 12L5.06999 8.81805L6.13066 7.75732L8.25195 9.8787L12.4946 5.63604L13.5553 6.6967L8.25195 12Z"
            fill="#999999"
          />
        </g>
      </g>
    </svg>
  )
}

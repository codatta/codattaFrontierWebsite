import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg width={size} height={(size * 25) / 24} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.717 4.25501C11.5109 3.78837 12.4891 3.78837 13.283 4.25501L18.717 7.44888C19.5109 7.91551 20 8.77789 20 9.71116V16.0989C20 17.0322 19.5109 17.8945 18.717 18.3612L13.283 21.5551C12.4891 22.0217 11.5109 22.0217 10.717 21.5551L5.283 18.3612C4.48908 17.8945 4 17.0322 4 16.0989V9.71116C4 8.77789 4.48908 7.91551 5.283 7.44888L10.717 4.25501Z"
        stroke={color}
        strokeWidth="1.2"
      />
      <circle cx="12" cy="12.905" r="3" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

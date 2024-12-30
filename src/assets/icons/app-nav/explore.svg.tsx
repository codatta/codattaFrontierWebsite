import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg width={size} height={(size * 25) / 24} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.3556 18.2708C18.8279 16.8011 19.7388 14.7691 19.7388 12.5244C19.7388 8.04021 16.1036 4.40503 11.6194 4.40503C7.13518 4.40503 3.5 8.04021 3.5 12.5244C3.5 17.0087 7.13518 20.6438 11.6194 20.6438C13.8589 20.6438 15.8866 19.7372 17.3556 18.2708ZM17.3556 18.2708L20.5 21.405"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

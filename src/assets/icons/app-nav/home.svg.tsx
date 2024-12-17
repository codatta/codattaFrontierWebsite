import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg
      width={size}
      height={(size * 25) / 24}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12.1277C3 11.3563 3.35618 10.628 3.96515 10.1544L10.4651 5.0988C11.3679 4.39664 12.6321 4.39664 13.5349 5.0988L20.0349 10.1544C20.6438 10.628 21 11.3563 21 12.1277V19.405C21 20.7857 19.8807 21.905 18.5 21.905H15.25V17.155C15.25 15.3601 13.7949 13.905 12 13.905V13.905C10.2051 13.905 8.75 15.3601 8.75 17.155V21.905H5.5C4.11929 21.905 3 20.7857 3 19.405V12.1277Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

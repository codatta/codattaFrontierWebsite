import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg
      width={size}
      height={(size * 25) / 24}
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        //  fill={color}
        stroke={color}
        d="M16.298 7.29943L17.1533 6.44419C17.4219 6.17561 17.4219 5.74016 17.1533 5.47158C16.8848 5.20299 16.4493 5.20299 16.1807 5.47158L15.2842 6.3681C14.0119 5.39644 12.4288 4.8125 10.7083 4.8125C6.53834 4.8125 3.14575 8.20508 3.14575 12.375C3.14575 16.5449 6.53834 19.9375 10.7083 19.9375C14.8782 19.9375 18.2708 16.5449 18.2708 12.375C18.2708 10.4207 17.519 8.64326 16.298 7.29943ZM10.7083 18.5625C7.29642 18.5625 4.52075 15.7868 4.52075 12.375C4.52075 8.96317 7.29642 6.1875 10.7083 6.1875C14.1201 6.1875 16.8958 8.96317 16.8958 12.375C16.8958 15.7868 14.1201 18.5625 10.7083 18.5625ZM12.954 13.2C13.2575 13.4283 13.319 13.859 13.0908 14.1625C12.9569 14.3421 12.7497 14.4375 12.5398 14.4375C12.3968 14.4375 12.252 14.3926 12.1282 14.3L10.2949 12.925C10.1226 12.7948 10.0199 12.5913 10.0199 12.375V9.16667C10.0199 8.78717 10.3279 8.47917 10.7074 8.47917C11.0869 8.47917 11.3949 8.78717 11.3949 9.16667V12.0312L12.954 13.2ZM7.72909 2.75C7.72909 2.3705 8.03709 2.0625 8.41659 2.0625H12.9999C13.3794 2.0625 13.6874 2.3705 13.6874 2.75C13.6874 3.1295 13.3794 3.4375 12.9999 3.4375H8.41659C8.03709 3.4375 7.72909 3.1295 7.72909 2.75Z"
        fill="white"
      />
    </svg>
  )
}

import { Button, ButtonProps } from 'antd'
// import { forwardRef } from 'react'

// export const SoundButton = forwardRef(
//   (props: ButtonProps, ref: { current: HTMLButtonElement }) => {
//     const handleClick = (e) => {
//       props.onClick && props.onClick(e)
//     }

//     return (
//       <Button {...props} onClick={handleClick} ref={ref}>
//         {props.children}
//       </Button>
//     )
//   }
// )

export const SoundButton = (props: ButtonProps) => {
  const handleClick = (e) => {
    if (props.onClick) props.onClick(e)
  }

  return (
    <Button {...props} onClick={handleClick}>
      {props.children}
    </Button>
  )
}

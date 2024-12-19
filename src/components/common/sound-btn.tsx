// import soundUrl from '@/assets/sounds/click.mp3'
import { Button, ButtonProps } from 'antd'
import { forwardRef } from 'react'

// const sound = new Audio(soundUrl)

export const SoundButton = forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      // !props.disabled && sound.play()
      props?.onClick?.(e)
    }

    return (
      <Button {...props} onClick={handleClick} ref={ref}>
        {props.children}
      </Button>
    )
  }
)

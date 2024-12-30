import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons'
import AngleRight from '@/assets/crypto/angle-right.svg'

type TProps = {
  preDisabled?: boolean
  nextDisabled?: boolean
  showArrows?: boolean
  onClick(type: 'pre' | 'next' | 'more'): void
}

export default function Navigation({ preDisabled, nextDisabled, showArrows = true, onClick }: TProps) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex">
        <div className="text-lg font-bold text-white/80">Validation</div>
        <div className={showArrows ? '' : 'invisible'}>
          <LeftCircleFilled
            className="px-2"
            style={{
              fontSize: '20px',
              opacity: preDisabled ? 0.12 : 1,
              cursor: preDisabled ? 'not-allowed' : 'pointer'
            }}
            onClick={() => !preDisabled && showArrows && onClick && onClick('pre')}
          />
          <RightCircleFilled
            className="px-2"
            style={{
              fontSize: '20px',
              opacity: nextDisabled ? 0.12 : 1,
              cursor: nextDisabled ? 'not-allowed' : 'pointer'
            }}
            onClick={() => !nextDisabled && showArrows && onClick && onClick('next')}
          />
        </div>
      </div>
      <div onClick={() => onClick && onClick('more')} className="flex cursor-pointer items-center">
        <div className="text-xs font-normal text-white/80">History</div>
        <AngleRight size={14} />
      </div>
    </div>
  )
}

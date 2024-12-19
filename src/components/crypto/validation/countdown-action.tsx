import CountDown from '@/components/common/countdown'
import Stopwatch from '@/assets/icons/stopwatch.svg'

import {
  changeValidationFilter,
  validationFilterStore
} from '@/stores/validation-filter.store'
import { useSnapshot } from 'valtio'

const Index = ({ gmt }: { gmt: string }) => {
  const {
    pageData: { page }
  } = useSnapshot(validationFilterStore)
  return (
    <>
      <Stopwatch size={24} />
      <CountDown
        onTimeout={() => changeValidationFilter({ pageData: { page } })}
        gmt={gmt}
        className="font-semibold"
      />
    </>
  )
}

export default Index

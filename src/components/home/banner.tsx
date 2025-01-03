import { Carousel } from 'antd'
import useHomeStore, { reloadAnnoucements } from '@/stores/home.store'
import ImageLogoGray from '@/assets/home/logo-gray.svg'
import { useEffect } from 'react'
import { parseSchema } from '@/utils/schema'
import { useNavigate } from 'react-router-dom'

export default function Banner() {
  const { announcements: list } = useHomeStore()
  const navigate = useNavigate()

  const onClickBanner = (schema: string = '') => {
    if (schema) {
      const { isApp, isSelf, to, params } = parseSchema(schema)

      if (isApp) {
        navigate(to, { state: params })
      } else if (isSelf) {
        location.href = schema
      } else {
        window.open(schema, '_blank')
      }
    }
  }

  useEffect(() => {
    reloadAnnoucements()
  }, [])

  return (
    <div
      className="aspect-[4/1] w-full overflow-hidden rounded-3xl bg-gray-100 bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${ImageLogoGray})` }}
    >
      {/* {list.length !== 0 && */}
      {/* <Carousel
        className="w-full bg-gray-100"
        autoplay={true}
        arrows={false}
        autoplaySpeed={5000}
        dots={list.length > 1}
      >
        {list.map((card, _index) => (
          <div key={card.name + _index}>
            <div
              className="flex min-w-0 cursor-pointer items-center justify-center"
              style={{
                cursor: card?.ext_info?.schema ? 'pointer' : 'not-allowed'
              }}
              onClick={() => onClickBanner(card?.ext_info?.schema)}
            >
              <img src={card?.ext_info?.image} className="w-full" />
            </div>
          </div>
        ))}
      </Carousel> */}
      {/* } */}
    </div>
  )
}

import { useRef, useState } from 'react'
import { Carousel, Image } from 'antd'

import AngleRightCircle from '@/assets/crypto/angle-right-circle.svg'
import AngleLeftCircle from '@/assets/crypto/angle-left-circle.svg'
import { CarouselRef } from 'antd/es/carousel'

const Index = ({ files }: { files: { path: string }[] }) => {
  const carouselEL = useRef<CarouselRef>(null)
  const [index, setIndex] = useState(1)

  return (
    <div className="relative size-full">
      {index !== 1 && (
        <div
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            carouselEL.current?.prev()
          }}
        >
          <AngleLeftCircle size={32} />
        </div>
      )}
      {index !== files.length && (
        <div
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            carouselEL.current?.next()
          }}
        >
          <AngleRightCircle size={32} />
        </div>
      )}
      <Carousel
        infinite={false}
        dots={false}
        ref={carouselEL}
        afterChange={(current) => {
          setIndex(current + 1)
        }}
      >
        {files.map((item) => (
          <div className="[&>.ant-image]:[360px] h-[360px] w-[688px] [&>.ant-image]:flex [&>.ant-image]:w-[688px]">
            <Image
              className="max-h-full max-w-full object-contain"
              src={item?.path}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default Index

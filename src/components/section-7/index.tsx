import { cn } from '@udecode/cn'
import blogCardImg from '@/assets/blog-card-default.png'

type TCard = {
  img?: string
  title: string
  des: string
  url: string
}

const CARDS = [
  {
    img: blogCardImg,
    title: "The worst advice we've everheard about web design",
    des: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking overpass is important',
    url: '',
  },
  {
    img: blogCardImg,
    title: "The worst advice we've everheard about web design",
    des: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking overpass is important',
    url: '',
  },
  {
    img: '',
    title: "The worst advice we've everheard about web design",
    des: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking overpass is important',
    url: '',
  },
  {
    img: '',
    title: "The worst advice we've everheard about web design",
    des: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking overpass is important',
    url: '',
  },
]

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <h3 className="flex items-center justify-between">
        <span className="text-[#1D1D1D] font-extrabold text-[32px] leading-10">
          Blog
        </span>
        <a className="text-[#1C1C26] font-medium text-xl">View more</a>
      </h3>
      <div>
        {CARDS.map((card) => (
          <Card data={card} />
        ))}
      </div>
    </div>
  )
}

function Card({ data }: { data: TCard }) {
  return (
    <div>
      {data.img && <img src={data.img} className="w-full mt-10" />}
      <h3 className="mt-8 font-semibold text-2xl leading-9 tracking-tight">
        <a href={data.url} target="_blank">
          {data.title}
        </a>
      </h3>
      <p className="mt-4 text-lg">{data.des}</p>
    </div>
  )
}

import { Network, Globe, Braces, Send } from 'lucide-react'
import CardHeader from './CardHeader'
import RunNum from './RunNum'

const Card = ({
  networkNum = 0,
  addressNum = 0,
  entityNum = 0,
  contributionAddressNum = 0,
}: {
  networkNum: number
  addressNum: number
  entityNum: number
  contributionAddressNum: number
}) => {
  return (
    <div className="rounded-3xl bg-#8AD4F90A bg-opacity-10 overflow-hidden mt-16px">
      <ul className="grid grid-cols-3 gap-1 px-32px pb-24px box-border list-none bg-#21FFE405 bg-opacity-2 my-0 pt-24px">
        <li className="col-span-1">
          <div>
            <Globe
              className="block"
              size={12}
              color="rgba(64, 246, 225, 0.93)"
            />
          </div>
          <div className="font-light text-10px leading-14px  mt-8px tracking-tight">
            Protocol distinct network
          </div>
          <RunNum num={networkNum} className="text-lg mt-4px" />
        </li>
        <li className="col-span-1">
          <div>
            <Network
              className="block"
              size={12}
              color="rgba(64, 246, 225, 0.93)"
            />
          </div>
          <div className="font-light text-10px leading-14px mt-8px tracking-tight">
            Protocol distinct address
          </div>
          <RunNum num={addressNum} className="text-lg mt-4px" />
        </li>
        <li className="col-span-1">
          <div>
            <Braces
              className="block"
              size={12}
              color="rgba(64, 246, 225, 0.93)"
            />
          </div>
          <div className="font-light text-10px leading-14px mt-8px tracking-tight">
            Protocol distinct entity
          </div>
          <RunNum num={entityNum} className="text-lg mt-4px" />
        </li>
      </ul>
      <div className="mt-10px">
        <div className="pl-32px">
          <CardHeader
            Icon={Send}
            isBigIcon={true}
            title="Labelled Addresses"
            num={contributionAddressNum}
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="339"
          height="195"
          viewBox="0 0 339 195"
          fill="none"
          className="block w-full mt-16px"
        >
          <path
            opacity="0.2"
            d="M-1.00971e-05 142.285L2.10614 140.217L4.21229 165.45L6.31847 168.035L8.42462 141.202L10.5308 137.362L12.6369 148.439L14.7431 143.344L16.8493 122.468L18.9554 177.414L21.0616 166.927L23.1677 136.475L25.2739 146.445L27.3801 183.199L29.4862 137.435L31.5924 129.878L33.6985 187.704L35.8047 181.352L37.9108 171.826L40.017 167.739L42.1232 130.321L44.2293 154.766L46.3355 168.428L48.4416 106.615L50.5478 126.776L52.654 144.377L54.7601 126.358L56.8663 187.088L58.9724 142.359L61.0786 102.159L63.1847 110.8L65.2909 148.193L67.3971 135.688L69.5032 152.969L71.6094 143.811L73.7155 150.679L75.8217 126.284L77.9278 152.28L80.034 173.426L82.1402 194.326L84.2463 187.704L86.3525 165.351L88.4587 92.3863L90.5648 108.412L92.671 132.537L94.7771 101.938L96.8833 137.559L98.9894 111.021L101.096 126.702L103.202 127.786L105.308 128.475L107.414 120.007L109.52 92.5586L111.626 79.8315L113.733 99.6729L115.839 81.6778L117.945 111.317L120.051 71.0679L122.157 157.449L124.263 170.053L126.37 116.536L128.476 92.4355L130.582 87.5613L132.688 86.8966L134.794 75.5728L136.9 84.2872L139.006 115.329L141.113 78.3299L143.219 103.562L145.325 69.5908L147.431 72.1756L149.537 111.243L151.643 107.452L153.75 111.464L155.856 92.7063L157.962 94.7741L160.068 76.459L162.174 85.9858L164.28 73.2834L166.387 90.4661L168.493 88.4229L170.599 91.9431L172.705 54.8698L174.811 61.2457L176.917 81.087L179.023 74.8589L181.13 85.4935L183.236 64.692L185.342 83.081L187.448 67.5722L189.554 66.883L191.66 73.5296L193.679 78.2068L195.785 65.6521L197.891 71.2894L199.997 65.7013L202.103 57.0361L204.21 81.9732L206.316 71.7572L208.422 74.0219L210.528 80.127L212.634 61.9842L214.74 114.345L216.847 117.693L218.953 106.836L221.059 95.8573L223.165 74.7112L225.271 99.5006L227.377 65.0367L229.484 80.5454L231.59 161.24L233.696 133.398L235.802 85.0996L237.908 77.9606L240.014 62.7227L242.12 110.751L244.227 111.834L246.333 96.2265L248.439 58.9563L250.545 77.2468L252.651 97.1373L254.757 81.5547L256.864 52.9005L258.97 47.0662L261.076 69.197L263.182 58.7593L265.288 59.0794L267.394 67.1291L269.501 44.1614L271.607 41.2074L273.713 76.0651L275.819 48.1001L277.925 56.593L280.031 75.7697L282.137 90.4415L284.244 100.584L286.35 62.8212L288.456 53.5405L290.562 71.4371L292.668 112.621L294.774 87.4382L296.881 92.6078L298.987 94.6018L301.093 61.5903L303.199 47.7063L305.305 53.2205L307.411 56.1253L309.518 42.0936L311.624 30.1543L313.73 72.5695L315.836 118.136L317.942 91.7216L320.048 66.3906L322.154 75.3512L324.261 42.5859L326.367 14.2271L328.473 1.37695L330.579 7.13735L332.685 28.628L334.791 39.0411L336.898 32.8129L339 14.5963"
            stroke="#17CFCF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default Card

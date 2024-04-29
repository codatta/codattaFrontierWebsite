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
    <div className="rounded-3xl bg-#21ffe4 bg-opacity-6 overflow-hidden">
      <ul className="flex justify-between px-32px pb-24px items-center justify-center box-border list-none bg-#21FFE405 bg-opacity-2 mt-0 pt-24px">
        <li className="flex-1">
          <div className="font-light text-sm flex items-center">
            <Globe
              className="mr-12px"
              size={14}
              color="rgba(64, 246, 225, 0.93)"
            />
            <span>Protocol distinct network</span>
          </div>
          <RunNum num={networkNum} className="text-2xl mt-8px ml-26px" />
        </li>
        <li className="flex-1">
          <div className="font-light text-sm flex items-center">
            <Network
              className="mr-12px"
              size={14}
              color="rgba(64, 246, 225, 0.93)"
            />
            <span>Protocol distinct address</span>
          </div>
          <RunNum num={addressNum} className="text-2xl mt-8px ml-26px" />
        </li>
        <li className="flex-1">
          <div className="font-light text-sm flex items-center">
            <Braces
              className="mr-12px"
              size={14}
              color="rgba(64, 246, 225, 0.93)"
            />
            <span>Protocol distinct entity</span>
          </div>
          <RunNum num={entityNum} className="text-2xl mt-8px ml-26px" />
        </li>
      </ul>
      <div className="mt-24px">
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
          width="774"
          height="213"
          fill="none"
          viewBox="0 0 774 213"
          className="block w-110% object-fit"
        >
          <path
            stroke="#17CFCF"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="m0 143.113 4.809-2.757 4.808 33.643 4.81 3.446 4.808-35.776 4.809-5.121 4.808 14.77 4.81-6.794 4.808-27.834 4.809 73.261 4.808-13.983 4.81-40.601 4.808 13.293 4.809 49.004 4.809-61.017 4.808-10.077 4.809 77.101 4.809-8.468 4.809-12.703 4.808-5.448 4.81-49.891 4.808 32.593 4.809 18.217 4.808-82.418 4.809 26.881 4.809 23.469 4.809-24.027 4.808 80.974 4.809-59.639 4.809-53.6 4.809 11.522 4.808 49.857 4.809-16.674 4.809 23.042 4.809-12.21 4.808 9.157 4.809-32.527 4.809 34.661 4.809 28.195 4.808 27.866 4.809-8.829 4.809-29.803 4.809-97.287 4.808 21.368 4.809 32.166 4.809-40.799 4.809 47.495 4.808-35.383 4.809 20.908 4.809 1.444 4.809.919 4.808-11.291 4.809-36.597 4.809-16.97 4.809 26.456 4.808-23.994 4.809 39.519 4.809-53.665 4.809 115.175 4.808 16.805 4.809-71.357 4.809-32.133 4.809-6.5 4.808-.885 4.809-15.099 4.809 11.62 4.809 41.389 4.808-49.333 4.809 33.644 4.809-45.296 4.809 3.447 4.808 52.089 4.809-5.054 4.809 5.35 4.809-25.011 4.808 2.757 4.809-24.42 4.809 12.702 4.809-16.936 4.808 22.91 4.809-2.724 4.809 4.693 4.809-49.43 4.808 8.5 4.809 26.455 4.809-8.304 4.809 14.18 4.808-27.736 4.809 24.52 4.809-20.68 4.809-.918 4.808 8.862 4.609 6.236 4.809-16.74 4.808 7.517 4.809-7.45 4.809-11.554 4.809 33.25 4.808-13.622 4.809 3.02 4.809 8.14 4.809-24.191 4.808 69.814 4.809 4.464 4.809-14.475 4.809-14.639 4.808-28.195 4.809 33.053 4.809-45.952 4.809 20.678 4.808 107.593 4.809-37.122 4.809-64.399 4.809-9.518 4.808-20.317 4.809 64.037 4.809 1.444 4.809-20.81 4.808-49.693 4.809 24.387 4.809 26.52 4.809-20.776 4.808-38.206 4.809-7.779 4.809 29.508 4.809-13.917 4.808.427 4.809 10.733 4.809-30.624 4.809-3.938 4.808 46.477 4.809-37.287 4.809 11.324 4.809 25.569 4.808 19.562 4.809 13.523 4.809-50.35 4.809-12.374 4.808 23.862 4.809 54.912 4.809-33.577 4.809 6.892 4.808 2.66 4.809-44.016 4.809-18.512 4.809 7.352 4.808 3.873 4.809-18.709 4.809-15.919 4.809 56.554 4.808 60.755 4.809-35.22 4.809-33.774 4.809 11.948 4.808-43.687 4.809-37.812 4.809-17.134 4.809 7.68 4.808 28.655 4.809 13.884L769.2-2.85l4.8-24.289"
            opacity=".2"
          />
        </svg>
      </div>
    </div>
  )
}

export default Card

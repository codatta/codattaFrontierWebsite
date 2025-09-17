import descriptionBgp from '@/assets/leaderboard/description-bg.png'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import TrophyImage from '@/assets/airdrop-activity/trophy.png'
import { Select } from 'antd'
import { Pagination } from 'antd'

const FilterOptions: { label: string; value: SubmissionStatus }[] = [
  { label: 'All Status', value: 'ALL Status' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Completed', value: 'Completed' }
]

function Headerback() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <h1>Back</h1>
    </div>
  )
}

function AirdropActivityHistoryHeader() {
  return (
    <div
      className="relative flex w-full items-center gap-[60px] rounded-2xl bg-[length:auto_100%] bg-center bg-repeat py-[34px] pr-[60px]"
      style={{ backgroundImage: `url("${descriptionBgp}")` }}
    >
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="flex h-[100px] w-[240px] items-center">
          <img src={TrophyImage} alt="" className="w-full" />
        </div>
      </div>
      <div className="flex flex-auto flex-wrap items-center justify-center gap-2">
        <div className="rounded-full border px-2 py-0.5">Current Season</div>
        <h1 className="text-nowrap text-2xl font-bold">AI Experts Season 1</h1>
      </div>
      <div className="flex flex-auto flex-wrap items-center justify-center gap-2">
        <div className="text-nowrap rounded-full border px-2 py-0.5">Total Points</div>
        <div className="text-nowrap text-2xl font-bold text-[#FCC800]">12,034</div>
      </div>
    </div>
  )
}

function HistoryItem() {
  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr] rounded-2xl border border-white/5 p-6">
      <div className="">
        <p className="mb-1.5 text-[#BBBBBE]">Frontier</p>
        <p>NFT Classification Frontier</p>
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Task</p>
        <p>NFT Classification Frontier</p>
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Status</p>
        <p>Success</p>
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Points</p>
        <div className="inline-block rounded-full bg-primary/20 px-2 py-0.5 font-bold text-primary">+234</div>
      </div>
    </div>
  )
}

export default function AirdropActivityHistory() {
  function handleStatusChange(value: string) {
    console.log(value)
  }

  return (
    <div>
      <Headerback></Headerback>
      <div>
        <div className="mb-16">
          <AirdropActivityHistoryHeader></AirdropActivityHistoryHeader>
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Activity History</h2>
            <div className="ml-auto flex items-center gap-2">
              <Select
                options={FilterOptions}
                defaultValue="All Status"
                className="w-[160px]"
                classNames={{ root: '[&_.ant-select-selector]:!rounded-full' }}
                onChange={handleStatusChange}
                size="large"
              ></Select>
              <Select
                options={FilterOptions}
                defaultValue="All Status"
                className="w-[160px]"
                classNames={{ root: '[&_.ant-select-selector]:!rounded-full' }}
                onChange={handleStatusChange}
                size="large"
              ></Select>
              <Select
                options={FilterOptions}
                defaultValue="All Status"
                className="w-[160px]"
                classNames={{ root: '[&_.ant-select-selector]:!rounded-full' }}
                onChange={handleStatusChange}
                size="large"
              ></Select>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 flex gap-2 text-[#BBBBBE]">
        <Info></Info>
        <span>
          season event points and records will be cleared after the start of the next cycle's activity, and submitted
          records can be viewed in the corresponding frontier.
        </span>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        {[1, 2, 3].map((item) => (
          <HistoryItem key={item}></HistoryItem>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination current={1} total={10}></Pagination>
      </div>
    </div>
  )
}

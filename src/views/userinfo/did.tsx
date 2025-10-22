import { Button } from 'antd'

import CheckboxIcon from '@/assets/common/checkbox-circle-line.svg?react'
import DoubleCheckIcon from '@/assets/userinfo/check-double-fill-icon.svg?react'

export default function UserInfoDid() {
  return (
    <div>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Register DID</h3>
      <RegisterDidView />
    </div>
  )
}

function RegisterDidView() {
  return (
    <div className="mx-auto my-12 w-[612px] text-base">
      <h4 className="text-xl font-bold">Create DlD & Apply Authorization</h4>
      <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
        <p>
          This will send a transaction on <span className="font-bold">Base</span> and incur gas.
        </p>
        <p className="font-bold"> Do you want to continue?</p>
        <div className="mt-6 rounded-2xl bg-[#1C1C26] px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Owner地址</span>
            <span>8453(0x2105)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Gas预估</span>
            <span>8453(0x2105)</span>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-[#1C1C26] px-5 py-4">
          <h4 className="flex items-center gap-2 text-lg font-bold">
            <DoubleCheckIcon />
            On-chain transaction
          </h4>
          <p className="mt-[6px] flex items-center gap-2 text-sm text-[#77777D]">
            <div className="mx-2 h-[40px] w-px bg-[#FFFFFF1F]" />
            Transaction submitted, Waiting for on-chain confimation...
          </p>
          <h4 className="mt-2 flex items-center gap-2 text-lg font-bold">
            <DoubleCheckIcon />
            Account binding
          </h4>
          <p className="mt-[6px] flex items-center gap-2 text-sm text-[#77777D]">
            <div className="mx-2 h-[40px] w-px" />
            Approve the binding authorization in your wallet...
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#5DDD2214] p-3 text-[#5DDD22]">
          <CheckboxIcon className="size-6" />
          <span>DlD registered. Your account is now bound.</span>
        </div>
      </div>
      <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary">
        Done
      </Button>
    </div>
  )
}

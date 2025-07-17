export default function UserInfoOnchain() {
  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-6 text-[32px] font-bold leading-[48px]">Token Rewards</h3>
      <ComingSoon />
    </div>
  )
  // return <div className="flex-1">UserInfoOnchain</div>
}

function ComingSoon() {
  return (
    <div className="flex flex-1 items-center justify-center text-[48px] font-bold">
      <div className="h-[160px] w-full rounded-xl bg-[#252532] text-center leading-[160px] text-[#875DFF]">
        Coming Soon
      </div>
    </div>
  )
}

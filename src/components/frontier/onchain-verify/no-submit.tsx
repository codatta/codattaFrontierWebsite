import InfoSVG from '@/assets/frontier/onchain-verify/info.svg'
import PageHeader from './page-header'

export default function NoSubmit() {
  return (
    <>
      <PageHeader title="No Submission Data Available" />
      <div className="flex flex-col items-center px-6 py-[60px]">
        <img src={InfoSVG} alt="" className="mb-8" />
        <h2 className="mb-6 text-2xl font-bold">👍Great start! </h2>
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-[#252532] p-4 text-sm">
          <h3 className="text-center text-base font-semibold">Verification is a two-step process:</h3>
          <div className="flex items-start gap-3 text-[#BBBBBE]">
            <div className="w-[60px] shrink-0 rounded-full bg-[#875DFF]/10 text-center text-[#875DFF]">Step 1</div>
            <p>Complete the deposit hot wallet data annotation task in the campaign.</p>
          </div>
          <div className="flex items-start gap-3 text-[#BBBBBE]">
            <div className="w-[60px] shrink-0 rounded-full bg-[#875DFF]/10 text-center text-[#875DFF]">Step 2</div>
            <p>Complete the deposit hot wallet data annotation task in the campaign.</p>
          </div>
        </div>
        <div className="px-4 text-center">Return to this page to verify your completion.</div>
      </div>
    </>
  )
}

import AirdropActivityHero from '@/components/airdrop-activity/hero'
import AirdropActivityFrontierCard from '@/components/airdrop-activity/frontier-card'

export default function AirdropActivityHome() {
  return (
    <>
      <div className="mb-12">
        <AirdropActivityHero></AirdropActivityHero>
      </div>
      <h2 className="mb-6 text-xl font-bold">Frontier</h2>
      <div>
        <AirdropActivityFrontierCard></AirdropActivityFrontierCard>
      </div>
    </>
  )
}

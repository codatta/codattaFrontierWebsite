import trophy from '@/assets/leaderboard/trophy.svg'
import descriptionBgp from '@/assets/leaderboard/description-bg.png'

const DescriptionImage = () => {
  return (
    <div
      className="relative mb-10 flex h-[190px] w-full min-w-[800px] items-center rounded-2xl bg-[length:auto_100%] bg-center bg-repeat"
      style={{ backgroundImage: `url("${descriptionBgp}")` }}
    >
      <img className="top-[90px] mt-[-40px] h-[280px] w-auto" src={trophy} alt="" />
      <div className="pl-6 pr-40">
        <h2 className="text-2xl font-bold leading-9">Leaderboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Congratulations to our leaders who earned the top spot through excellent data contributions and exceptional
          data quality. Join them to achieve greater rewards together.
        </p>
      </div>
    </div>
  )
}

export default DescriptionImage

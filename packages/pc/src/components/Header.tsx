import { jump2App } from '@/utils/util'
import logoImg from '@/assets/images/icons/logo-white.png'

export default function Head() {

  return (
    <header className="m-auto p-4 flex items-center max-w-1240px box-border">
      <div>
        <img src={logoImg} className='block h-6' alt="" />
      </div>
      <button
        className="ml-auto  cursor-pointer rounded-16px h-32px px-24px block border-none outline-none text-white text-sm border-1px border-solid border-#FFFFFF99 font-500 bg-transparent text-base text-nowrap"
        onClick={jump2App}
      >
        Launch App
      </button>
    </header>
  )
}
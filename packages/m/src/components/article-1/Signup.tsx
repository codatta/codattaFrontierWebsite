import './Signup.scss'

export default function Signup() {
  return (
    <div className="signup text-sm color-#fff">
      <input
        placeholder="Email address"
        className="email-input rounded-lg bg-white w-299px h-38px"
      />
      <button className="signup-btn rounded-lg color-#fff bold w-299px h-38px mt-16px">
        Sign up for THE Great Mission
      </button>
      <div className="w-299px h-1px bg-#fff opacity-10 mt-16px"></div>
      <button className="wallet-btn rounded-lg color-#fff bold w-299px h-38px mt-16px">
        Start with your wallet
      </button>
    </div>
  )
}

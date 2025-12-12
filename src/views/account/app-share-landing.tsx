import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CodattaLogoIcon from '@/assets/home/logo-gray.svg'
import ReferralCube from '@/assets/referral/gift-box.png'
import { channelStoreActions } from '@/stores/channel.store'

const ReferralLandingApp: React.FC = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  const referralCode = code ?? ''
  const referrerName = username ?? 'Your friend'

  const getUsername = (code: string) => {
    fetch('/api/user/username?' + new URLSearchParams({ code }), {})
      .then((res) => res.json())
      .then(({ data: username }) => {
        setUsername(username)
      })
      .catch(() => {
        setUsername('Your friend')
      })
  }

  useEffect(() => {
    if (!code) {
      navigate('/app')
      return
    }
    getUsername(code)
    channelStoreActions.setChannelCode('referral-landing-app')
    channelStoreActions.setInviterCode(code)
  }, [code, navigate])

  const handleDownloadApp = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroid = userAgent.includes('android')
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad')

    if (isAndroid) {
      window.location.href = 'https://play.google.com/store/apps/details?id=io.codatta.app'
    } else if (isIOS) {
      window.location.href = 'https://apps.apple.com/app/codatta'
    } else {
      window.location.href = 'https://codatta.io/download'
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-black/10 bg-white/20 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src={CodattaLogoIcon} alt="Codatta" className="size-7" />
          <span className="text-[20px] font-bold text-black">Codatta</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Title */}
        <h1 className="mb-8 text-center text-[28px] font-bold leading-tight text-black">
          {referrerName}
          <br />
          invites you to
          <br />
          explore together!
        </h1>

        {/* Invitation Card */}
        <div className="relative overflow-hidden rounded-3xl bg-black p-8 text-white">
          {/* Cube Image */}
          <div className="mb-8 flex justify-center">
            <img src={ReferralCube} alt="Referral" className="h-40 w-auto" />
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="mb-3 text-[20px] font-bold">Invite friends to win the rewards together</h2>
            <p className="mb-6 text-[14px] text-gray-300">
              For every friend who joins,
              <br />
              you'll both get 100 points.
            </p>

            {/* Referral Code */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <span className="text-[13px] text-gray-400">Referral Code</span>
              <button onClick={handleCopyCode} className="text-[16px] font-bold tracking-wider text-white">
                {referralCode}
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadApp}
              className="w-full rounded-full bg-white py-4 text-[17px] text-black transition-all hover:bg-gray-100"
            >
              Download APP
            </button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mt-12 rounded-2xl bg-[#F5F5F5] p-6">
          <h3 className="mb-6 text-[17px] font-bold text-black">
            Start contributing in three simple
            <br />
            steps
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="relative flex items-center gap-4 rounded-2xl border border-black/10 p-6">
              <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-black px-4 py-1 text-[13px] font-bold text-white">
                Step 1
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.0001 2.66699C23.3601 2.66699 29.3334 8.64033 29.3334 16.0003C29.3334 23.3603 23.3601 29.3337 16.0001 29.3337C8.64008 29.3337 2.66675 23.3603 2.66675 16.0003C2.66675 8.64033 8.64008 2.66699 16.0001 2.66699ZM17.3334 16.0003V10.667H14.6667V16.0003H10.6667L16.0001 21.3337L21.3334 16.0003H17.3334Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span className="text-[17px] font-semibold text-black">Download</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center gap-4 rounded-2xl border border-black/10 p-6">
              <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-black px-4 py-1 text-[13px] font-bold text-white">
                Step 2
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3325 14.667H2.73169C3.40065 7.92923 9.08538 2.66699 15.9992 2.66699C23.363 2.66699 29.3326 8.63653 29.3326 16.0003C29.3326 23.3641 23.363 29.3337 15.9992 29.3337C9.08538 29.3337 3.40065 24.0714 2.73169 17.3337H13.3325V21.3337L19.9992 16.0003L13.3325 10.667V14.667Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span className="text-[17px] font-semibold text-black">Sign Up</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center gap-4 rounded-2xl border border-black/10 p-6">
              <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-black px-4 py-1 text-[13px] font-bold text-white">
                Step 3
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M26.6731 17.3376V26.6709C26.6731 27.4073 26.0762 28.0042 25.3398 28.0042H6.6731C5.93672 28.0042 5.33976 27.4073 5.33976 26.6709V17.3376H26.6731ZM19.3398 2.6709C21.9171 2.6709 24.0065 4.76023 24.0065 7.33757C24.0065 8.05383 23.8451 8.73242 23.5567 9.33895L28.0065 9.33757C28.7429 9.33757 29.3398 9.93451 29.3398 10.6709V14.6709C29.3398 15.4073 28.7429 16.0042 28.0065 16.0042H4.00643C3.27006 16.0042 2.6731 15.4073 2.6731 14.6709V10.6709C2.6731 9.93451 3.27006 9.33757 4.00643 9.33757L8.45618 9.33895C8.1678 8.73242 8.00643 8.05383 8.00643 7.33757C8.00643 4.76023 10.0958 2.6709 12.6731 2.6709C13.9798 2.6709 15.161 3.20791 16.0081 4.07327C16.8519 3.20791 18.0331 2.6709 19.3398 2.6709ZM12.6731 5.33757C11.5685 5.33757 10.6731 6.23299 10.6731 7.33757C10.6731 8.37715 11.4663 9.2315 12.4805 9.32841L12.6731 9.33757H14.6731V7.33757C14.6731 6.29797 13.8799 5.44363 12.8657 5.34671L12.6731 5.33757ZM19.3398 5.33757L19.1471 5.34671C18.1963 5.43758 17.4398 6.19414 17.3489 7.14495L17.3398 7.33757V9.33757H19.3398L19.5323 9.32841C20.5466 9.2315 21.3398 8.37715 21.3398 7.33757C21.3398 6.29797 20.5466 5.44363 19.5323 5.34671L19.3398 5.33757Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span className="text-[17px] font-semibold text-black">Reward</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralLandingApp

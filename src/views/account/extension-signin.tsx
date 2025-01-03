import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import NoTextLogoWhite from '@/assets/common/logo-white-notext.svg'
import ExtensionChecker from '@/components/account/extension-checker'

const extensionId = 'doklnekkemmhclakfekoccilofpdcncb'
function Loading() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <LoaderCircle className="animate-spin" size={30} />
    </div>
  )
}

function ExtensionSingInSuccess() {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/app')
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <img className="mb-6" src={NoTextLogoWhite} alt="" />
      <div className="mb-3 text-3xl font-bold text-gray-900">Extension Login success</div>
      <div
        className="cursor-pointer border-b border-primary text-base font-normal italic text-gray-900"
        onClick={handleGoToHome}
      >
        <span>Enter codatta webapp</span>
      </div>
    </div>
  )
}

function ExtensionSingInFail() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <div className="text-3xl font-bold text-gray-900">Login failed</div>
    </div>
  )
}

function ExtensionLogin() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<boolean | null>(null)
  const { state } = useLocation()
  console.log(state, useParams())
  async function extensionLogin() {
    setLoading(true)
    try {
      const token = window.localStorage.getItem('token')
      const uid = window.localStorage.getItem('uid')
      const new_user = !!state?.new_user
      const inviter_code = state?.inviter_code
      const res = await window.chrome.runtime.sendMessage(extensionId, {
        id: 'web-login',
        params: { token, uid, showInviterCode: !inviter_code && new_user }
      })
      setResult(res === 'success')
    } catch (err) {
      console.log(err)
      setResult(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    extensionLogin()
  }, [])

  if (loading) return <Loading></Loading>
  else if (result) return <ExtensionSingInSuccess></ExtensionSingInSuccess>
  else return <ExtensionSingInFail></ExtensionSingInFail>
}

export default function Component() {
  return (
    <ExtensionChecker check={true}>
      <ExtensionLogin />
    </ExtensionChecker>
  )
}

import { useEffect, useState } from 'react'
import NoTextLogoWhite from '@/assets/common/logo-white-notext.svg'
import { LoaderCircle } from 'lucide-react'
const extensionId = 'doklnekkemmhclakfekoccilofpdcncb'

function Loading() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <LoaderCircle className="animate-spin" />
    </div>
  )
}

function NoExtension() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <img className="mb-6" src={NoTextLogoWhite} alt="" />
      <div className="mb-3 text-3xl font-bold text-gray-900">Please install the extension</div>
      <a className="text-base" href={`https://chrome.google.com/webstore/detail/${extensionId}`}>
        <div className="text-base font-bold text-gray-700">Click here to download</div>
      </a>
    </div>
  )
}

export default function ExtensionChecker(props: { children: React.ReactNode; check: boolean }) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<boolean | null>(null)

  async function checkExtension() {
    try {
      const res = await window.chrome?.runtime.sendMessage(extensionId, {
        id: 'hello-extension'
      })
      setResult(res === 'success')
    } catch (err) {
      console.log(err)
      setResult(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkExtension()
  }, [])

  if (!props.check) return <>{props.children}</>
  if (loading) return <Loading></Loading>
  else if (result) return <>{props.children}</>
  else return <NoExtension></NoExtension>
}

// import { shortenAddress } from '@/utils/wallet-address'
import { Button, Modal, Spin } from 'antd'
import {
  Check,
  Edit,
  Mail,
  MinusCircle,
  PlusCircle,
  Upload,
  UserCircleIcon,
  Wallet as WalletIcon,
  X
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import TransitionEffect from '@/components/common/transition-effect'

// import accountApi from '@/api/account.api'
// import { AccountItem } from '@/api/user.api'
// import commonApi from '@/api/common.api'
// import TaskTarget from '@/components/common/task-target'
// import { DynamicView, updateDynamicView } from '@/store/dynamic.store'
// import { userStoreActions, useUserStore } from '@/store/user.store'
// import {
//   TonProofItemReplySuccess,
//   Wallet,
//   useTonConnectModal,
//   useTonConnectUI,
//   useTonWallet,
// } from '@tonconnect/ui-react'
// import { message } from 'antd'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import TaskTarget from '@/components/common/task-target'
import commonApi from '@/api-v1/common.api'
import { shortenAddress } from '@/utils/wallet-address'
import { UserAccount } from '@/apis/user.api'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
// import SocialLinkButtons from '@/components/account/social-link-buttons'

async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

// function TonLink(props: { onLoading: () => void; onFinish: () => void }) {
// const { onLoading, onFinish } = props
// const [tonConnectUI] = useTonConnectUI()
// tonConnectUI.setConnectRequestParameters({ state: 'loading' })

// async function tonLink(walletInfo: Wallet) {
//   onLoading()
//   try {
//     const account = walletInfo.account
//     const proof = walletInfo.connectItems?.tonProof as TonProofItemReplySuccess

//     const res = await accountApi.linkTonWallet({
//       wallet_name: walletInfo.device.appName,
//       account: {
//         address: account.address,
//         chain: account.chain as any,
//         walletStateInit: account.walletStateInit,
//         publicKey: account.publicKey,
//       },
//       ton_proof: {
//         domain_len: proof.proof.domain.lengthBytes,
//         domain_val: proof.proof.domain.value,
//         payload: proof.proof.payload,
//         signature: proof.proof.signature,
//         timestamp: proof.proof.timestamp,
//       },
//     })
//     userApi.getDetail()
//     message.success('Link TON wallet success')
//   } catch (err: any) {
//     tonConnectUI.disconnect()
//     message.error(err.message)
//   }
//   onFinish()
// }

// const wallet = useTonWallet()

// useEffect(() => {
//   if (!wallet) return
//   tonLink(wallet)
// }, [wallet])

// return <></>
// }

function UserAvatarEditor() {
  // const { info } = useUserStore()
  const [avatar, setAvatar] = useState('')
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const editor = useRef<AvatarEditor>(null)
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [scale, setScale] = useState(1)
  const [uploading, setUploading] = useState(false)

  // useEffect(() => {
  //   if (info?.avatar_url === avatar || !avatar) return
  //   if (avatar) userStoreActions.updateUserInfo({ avatar_url: avatar })
  // }, [avatar])

  // useEffect(() => {
  //   if (info?.avatar_url) setAvatar(info?.avatar_url)
  // }, [info?.avatar_url])

  function handleUploadImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        editAvatar(file)
      }
    }
    input.click()
  }

  function editAvatar(file: File) {
    setShowAvatarEditor(true)
    setScale(1)
    const reader = new FileReader()
    reader.onload = (e) => {
      const DataURL = e.target!.result as string
      setImageDataUrl(DataURL)
    }
    reader.readAsDataURL(file)
  }

  async function updateAvatar() {
    if (editor.current) {
      setUploading(true)
      const canvas = editor.current.getImage()
      const blob = await canvasToBlob(canvas)
      if (!blob) return
      const file = new File([blob], 'avatar.png', { type: 'image/png' })
      const res = await commonApi.uploadFile(file)
      if (res.file_path) {
        setAvatar(res.file_path)
        setShowAvatarEditor(false)
        setUploading(false)
      }
    }
  }

  return (
    <div className="flex items-start gap-6">
      <div className="block">
        {avatar ? (
          <img
            className="block rounded-full"
            src={avatar}
            height={80}
            width={80}
          />
        ) : null}
        {!avatar ? (
          <div className="flex size-[80px] items-center justify-center rounded-full border border-[rgba(48,0,64,0.06)] bg-[rgba(237,233,239,1)]">
            <UserCircleIcon
              size={40}
              className="text-[rgba(0,0,0,0.24)]"
            ></UserCircleIcon>
          </div>
        ) : null}
      </div>
      <div className="">
        <div className="mb-4 flex items-start justify-start gap-2">
          <img
            src="https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png"
            alt=""
            className="size-8 cursor-pointer rounded-full border-4 border-[rgba(48,0,64,0.06)]"
            onClick={() =>
              setAvatar(
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png'
              )
            }
          />
          <img
            src="https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png"
            alt=""
            className="size-8 cursor-pointer rounded-full border-4 border-[rgba(48,0,64,0.06)]"
            onClick={() =>
              setAvatar(
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png'
              )
            }
          />
        </div>
        <TaskTarget match={['target', 'avatar']}>
          <Button
            className="flex items-center gap-2 bg-white text-black"
            onClick={handleUploadImage}
          >
            <Upload size={14}></Upload>
            Change avatar
          </Button>
        </TaskTarget>
      </div>
      <Modal
        open={showAvatarEditor}
        title="Edit avatar"
        onOk={updateAvatar}
        onCancel={() => setShowAvatarEditor(false)}
        confirmLoading={uploading}
      >
        <div className="flex flex-col items-center gap-6">
          <AvatarEditor
            ref={editor}
            image={imageDataUrl}
            width={250}
            height={250}
            border={20}
            scale={scale}
          />
          <Button.Group size="large">
            <Button onClick={() => setScale(scale + 0.2)}>
              <PlusCircle></PlusCircle>
            </Button>
            <Button onClick={() => setScale(scale - 0.2)}>
              <MinusCircle></MinusCircle>
            </Button>
          </Button.Group>
        </div>
      </Modal>
    </div>
  )
}

function UserNameEditor() {
  const { info } = useUserStore()

  const [edit, setEdit] = useState(false)
  const [nickname, setNickname] = useState(info?.user_data.user_name)
  const [loading, _setLoading] = useState(false)

  async function handleUpdateUsername() {
    // try {
    //   setLoading(true)
    //   await userStoreActions.updateUserInfo({ username: nickname })
    //   setLoading(false)
    //   setEdit(false)
    // } catch (err: any) {
    //   message.error(err.message)
    //   setEdit(false)
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    setNickname(info?.user_data.user_name)
  }, [info?.user_data])

  return (
    <div className="flex items-center rounded-lg border border-white/10 px-4 py-2">
      {edit ? (
        <div className="flex flex-1 items-center justify-between gap-2">
          <input
            autoFocus
            className="h-full flex-1 bg-transparent outline-none"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button
            size="small"
            className="ml-auto"
            loading={loading}
            type="primary"
            onClick={handleUpdateUsername}
          >
            {!loading && <Check size={14} />}
          </Button>
          <Button
            size="small"
            className="ml-auto"
            type="primary"
            ghost
            onClick={() => setEdit(false)}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <>
          <div>{info?.user_data.user_name}</div>
          <TaskTarget
            match={['target', 'username']}
            className="ml-auto cursor-pointer"
          >
            <Edit
              size={24}
              className="p-1"
              onClick={() => setEdit(true)}
            ></Edit>
          </TaskTarget>
        </>
      )}
    </div>
  )
}

function EmailAccountItem(props: { account: UserAccount }) {
  const account = props.account
  // const { setShowAuthFlow } = useDynamicContext()

  // function handleChangeEmail() {
  // updateDynamicView(DynamicView.EMAIL_VIEW)
  // setShowAuthFlow(true)
  // }

  return (
    <div
      key={account.id}
      className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2"
    >
      <Mail size={16}></Mail>
      <div className="truncate">{shortenAddress(account.account, 16)}</div>
      {/* <Edit size={24} className="p-4px ml-auto shrink-0 cursor-pointer" onClick={handleChangeEmail}></Edit> */}
    </div>
  )
}

function WalletAccountItem(props: {
  account: UserAccount
  canUnbind: boolean | null
}) {
  const account = props.account
  // const canUnbind = props.canUnbind
  // const [loading, setLoading] = useState(false)

  const address = useMemo(() => {
    return account.connector == 'codatta_ton'
      ? toUserFriendlyAddress(account.account)
      : account.account
  }, [account])

  // async function handleUnlinkAccount() {
  //   Modal.confirm({
  //     title: 'Confirm unlink account',
  //     content: 'Are you sure to unlink this account?',
  //     onOk: async () => {
  //       setLoading(true)
  //       try {
  //         const res = await accountApi.unlinkAccount(account.account)
  //         message.success('Account unlink success.')
  //         userStoreActions.getUserDetail()
  //       } catch (err: any) {
  //         message.error(err.message)
  //       }
  //       setLoading(false)
  //     }
  //   })
  // }

  return (
    <div
      key={account.id}
      className="flex items-center gap-2 border-b border-white/10 py-3 last:border-b-0"
    >
      <div className="w-[120px]">{account.wallet_name}</div>
      <span>{shortenAddress(address, 12)}</span>
      {/* {canUnbind && (
        <Button type="text" size="small" loading={loading} onClick={handleUnlinkAccount} className="m-l-auto">
          {!loading && <Trash size={16}></Trash>}
        </Button>
      )} */}
    </div>
  )
}

function UserSecurity() {
  // const { setShowAuthFlow, handleLogOut } = useDynamicContext()
  // const isLogined = useIsLoggedIn()
  const { info } = useUserStore()
  // const { open } = useTonConnectModal()
  const [isLoading, _setIsLoading] = useState(false)
  // const userLinkAction = useRef(false)

  const emailAccounts = useMemo(() => {
    return info?.accounts_data.filter((item) => item.account_type === 'email')
  }, [info])
  const walletAccounts = useMemo(() => {
    return info?.accounts_data?.filter((item) =>
      ['blockchain', 'wallet'].includes(item.account_type)
    )
  }, [info])

  // async function handleBindAccount() {
  //   setIsLoading(true)
  //   try {
  //     // const token = getAuthToken()
  //     // const res = await accountApi.linkDynamic(token)
  //     userStoreActions.getUserInfo()
  //     message.success('Account bind success.')
  //   } catch (err) {
  //     message.error(err.message)
  //   }
  //   setIsLoading(false)
  //   // handleLogOut()
  // }

  // async function handleUpdateEmail() {
  //   userLinkAction.current = true
  //   await handleLogOut()
  //   updateDynamicView(DynamicView.EMAIL_VIEW)
  //   setShowAuthFlow(true)
  // }

  // async function handleLinkWallet() {
  //   userLinkAction.current = true
  //   await handleLogOut()
  //   updateDynamicView(DynamicView.WALLET_VIEW)
  //   setShowAuthFlow(true)
  // }

  // const [tonConnectUI] = useTonConnectUI()
  // tonConnectUI.setConnectRequestParameters({ state: 'loading' })

  // async function handleLinkTon() {
  //   if (tonConnectUI.connected) await tonConnectUI.disconnect()
  //   await tonConnectUI.openModal()
  //   const nonce = await accountApi.getNonce()
  //   tonConnectUI.setConnectRequestParameters({ state: 'ready', value: { tonProof: nonce } })
  // }

  useEffect(() => {
    // if (isLogined) {
    //   handleLogOut()
    // }
    // tonConnectUI.disconnect()
  }, [])

  // useEffect(() => {
  //   if (isLogined && userLinkAction.current) {
  //     handleBindAccount()
  //   }
  // }, [isLogined])

  function EmailConnectButton() {
    return (
      <button
        className="flex w-[162px] shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black"
        // onClick={handleUpdateEmail}
      >
        <Mail size={16} className="mr-2"></Mail>
        Connect Email
      </button>
    )
  }

  function WalletConnectButton() {
    return (
      <button
        // onClick={handleLinkWallet}
        className="flex w-[162px] shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black"
      >
        <WalletIcon size={16} className="mr-2"></WalletIcon>
        Connect Wallet
      </button>
    )
  }

  // function TonConnectButton() {
  //   return (
  //     <button
  //       className="rounded-8px w-162px font-600 px-16px py-12px leading-19px inline-block flex shrink-0 items-center bg-white text-black"
  //       // onClick={handleLinkTon}
  //     >
  //       <WalletIcon size={16} className="m-r-8px"></WalletIcon>
  //       TON Connect
  //     </button>
  //   )
  // }

  return (
    <Spin spinning={isLoading}>
      <div className="flex w-[338px] flex-col gap-4">
        {emailAccounts?.map((item) => {
          return (
            <EmailAccountItem key={item.id} account={item}></EmailAccountItem>
          )
        })}
        <div className="grid grid-cols-2 gap-3">
          {!emailAccounts?.length && (
            <TaskTarget match={['target', 'email']}>
              <EmailConnectButton />
            </TaskTarget>
          )}
          <TaskTarget match={['target', 'address']}>
            <WalletConnectButton />
          </TaskTarget>
        </div>
        <div className="rounded-xl bg-gray-200 px-4">
          {walletAccounts?.map((item) => {
            return (
              <WalletAccountItem
                key={item.account}
                account={item}
                canUnbind={
                  info && info?.accounts_data && info?.accounts_data.length > 1
                }
              ></WalletAccountItem>
            )
          })}
        </div>
        {/* <TonLink
          onLoading={() => setIsLoading(true)}
          onFinish={() => setIsLoading(false)}
        ></TonLink> */}
      </div>
    </Spin>
  )
}

export default function SettingsAccount() {
  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <TransitionEffect className="flex flex-1 flex-wrap gap-6 px-6">
      <div className="flex flex-1 flex-col text-sm">
        <h2 className="mb-4 font-semibold">Personal Info</h2>
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="mb-4 text-sm">Avatar</h3>
            <UserAvatarEditor></UserAvatarEditor>
          </div>
          <div>
            <h3 className="mb-4">Name</h3>
            <UserNameEditor></UserNameEditor>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="mb-4 text-base font-medium">Login & Secuity</h2>
          <UserSecurity></UserSecurity>
        </div>
      </div>
      {/* <div className=" flex-1">
        <div className="w-338px">
          <h2 className="mb-16px font-500 text-base">Connect Account</h2>
          <SocialLinkButtons />
        </div>
      </div> */}
    </TransitionEffect>
  )
}

// import { shortenAddress } from '@/utils/wallet-address'
import { Button, message, Modal, Spin } from 'antd'
import {
  Check,
  Edit,
  Mail,
  MinusCircle,
  PlusCircle,
  Trash,
  Upload,
  UserCircleIcon,
  Wallet as WalletIcon,
  X
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import TransitionEffect from '@/components/common/transition-effect'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import TaskTarget from '@/components/common/task-target'
import commonApi from '@/api-v1/common.api'
import { shortenAddress } from '@/utils/wallet-address'
import { UserAccount } from '@/apis/user.api'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
import accountApi from '@/apis/account.api'
import { CodattaConnect, EmvWalletConnectInfo, TonWalletConnectInfo } from 'codatta-connect'

async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

function UserAvatarEditor() {
  const [avatar, setAvatar] = useState('')
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const editor = useRef<AvatarEditor>(null)
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [scale, setScale] = useState(1)
  const [uploading, setUploading] = useState(false)

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

  useEffect(() => {
    console.log('avatar', avatar)
    if (avatar) {
      userStoreActions.updateUserInfo({ update_key: 'AVATAR', update_value: avatar })
    }
  }, [avatar])

  return (
    <div className="flex items-start gap-6">
      <div className="block">
        {avatar ? <img className="block rounded-full" src={avatar} height={80} width={80} /> : null}
        {!avatar ? (
          <div className="flex size-[80px] items-center justify-center rounded-full border border-[rgba(48,0,64,0.06)] bg-[rgba(237,233,239,1)]">
            <UserCircleIcon size={40} className="text-[rgba(0,0,0,0.24)]"></UserCircleIcon>
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
              setAvatar('https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png')
            }
          />
          <img
            src="https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png"
            alt=""
            className="size-8 cursor-pointer rounded-full border-4 border-[rgba(48,0,64,0.06)]"
            onClick={() =>
              setAvatar('https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png')
            }
          />
        </div>
        <TaskTarget match={['target', 'avatar']}>
          <Button className="flex items-center gap-2 bg-white text-black" onClick={handleUploadImage}>
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
          <AvatarEditor ref={editor} image={imageDataUrl} width={250} height={250} border={20} scale={scale} />
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
  const [loading, setLoading] = useState(false)

  async function handleUpdateUsername() {
    try {
      setLoading(true)
      await userStoreActions.updateUserInfo({ update_key: 'USER_NAME', update_value: nickname! })
      setLoading(false)
      setEdit(false)
    } catch (err) {
      message.error(err.message)
      setEdit(false)
      setLoading(false)
    }
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
          <Button size="small" className="ml-auto" loading={loading} type="primary" onClick={handleUpdateUsername}>
            {!loading && <Check size={14} />}
          </Button>
          <Button size="small" className="ml-auto" type="primary" ghost onClick={() => setEdit(false)}>
            <X size={14} />
          </Button>
        </div>
      ) : (
        <>
          <div>{info?.user_data.user_name}</div>
          <TaskTarget match={['target', 'username']} className="ml-auto cursor-pointer">
            <Edit size={24} className="p-1" onClick={() => setEdit(true)}></Edit>
          </TaskTarget>
        </>
      )}
    </div>
  )
}

function EmailAccountItem(props: { account: UserAccount; onEmailChangeClick: () => void }) {
  const account = props.account

  return (
    <div key={account.id} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2">
      <Mail size={16}></Mail>
      <div className="truncate">{shortenAddress(account.account, 16)}</div>
      <Edit size={24} className="ml-auto shrink-0 cursor-pointer p-1" onClick={props.onEmailChangeClick}></Edit>
    </div>
  )
}

function WalletAccountItem(props: { account: UserAccount; canUnbind: boolean | null }) {
  const account = props.account
  const canUnbind = props.canUnbind
  const [loading, setLoading] = useState(false)

  const address = useMemo(() => {
    return account.connector == 'codatta_ton' ? toUserFriendlyAddress(account.account) : account.account
  }, [account])

  async function handleUnlinkAccount() {
    Modal.confirm({
      title: 'Confirm unlink account',
      content: 'Are you sure to unlink this account?',
      onOk: async () => {
        setLoading(true)
        try {
          await accountApi.unbindAccount(account.account)
          message.success('Account unlink success.')
          userStoreActions.getUserInfo()
        } catch (err) {
          message.error(err.message)
        }
        setLoading(false)
      }
    })
  }

  return (
    <div key={account.id} className="flex items-center gap-2 border-b border-white/10 py-3 last:border-b-0">
      <div className="w-[120px]">{account.wallet_name}</div>
      <span>{shortenAddress(address, 12)}</span>
      {canUnbind && (
        <Button type="text" size="small" loading={loading} onClick={handleUnlinkAccount} className="ml-auto">
          {!loading && <Trash size={16}></Trash>}
        </Button>
      )}
    </div>
  )
}

function UserSecurity() {
  const { info } = useUserStore()
  const [isLoading, _setIsLoading] = useState(false)
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false)
  const [connectConfig, setConnectConfig] = useState({
    showEmailSignIn: false,
    showFeaturedWallets: true,
    showMoreWallets: true,
    showTonConnect: true
  })

  const emailAccounts = useMemo(() => {
    return info?.accounts_data.filter((item) => item.account_type === 'email')
  }, [info])

  const walletAccounts = useMemo(() => {
    return info?.accounts_data?.filter((item) => ['block_chain', 'wallet', 'blockchain'].includes(item.account_type))
  }, [info])

  async function handleTonWalletConnect(info: TonWalletConnectInfo) {
    const account = info.connect_info.account
    const connectItems = info.connect_info.connectItems
    if (!connectItems?.tonProof) return
    await accountApi.bindTonWallet({
      account_type: 'block_chain',
      connector: 'codatta_ton',
      account_enum: 'C',
      chain: info.connect_info.account.chain,
      wallet_name: info.connect_info.device.appName,
      address: info.connect_info.account.address,
      connect_info: [{ name: 'ton_addr', network: account.chain, ...account }, connectItems.tonProof]
    })
    message.success('Wallet bind success.')
    userStoreActions.getUserInfo()
    setShowWalletConnectModal(false)
  }

  async function handleEvmWalletConnect(info: EmvWalletConnectInfo) {
    await accountApi.bindEvmWallet({
      account_type: 'block_chain',
      connector: 'codatta_wallet',
      account_enum: 'C',
      chain: (await info.client.getChainId()).toString(),
      address: (await info.client.getAddresses())[0],
      signature: info.connect_info.signature,
      nonce: info.connect_info.nonce,
      wallet_name: info.connect_info.wallet_name,
      message: info.connect_info.message
    })
    message.success('Wallet bind success.')
    userStoreActions.getUserInfo()
    setShowWalletConnectModal(false)
  }

  async function handleEmailConnect(email: string, code: string) {
    console.log(email, code)
    await accountApi.bindEmail({
      connector: 'codatta_email',
      account_type: 'email',
      account_enum: 'C',
      email: email,
      email_code: code
    })
    message.success('Wallet bind success.')
    userStoreActions.getUserInfo()
    setShowWalletConnectModal(false)
  }

  function handleUpdateEmailClick() {
    setConnectConfig({
      showEmailSignIn: true,
      showFeaturedWallets: false,
      showMoreWallets: false,
      showTonConnect: false
    })
    setShowWalletConnectModal(true)
  }

  function handleWalletConnectClick() {
    setConnectConfig({
      showEmailSignIn: false,
      showFeaturedWallets: true,
      showMoreWallets: true,
      showTonConnect: true
    })
    setShowWalletConnectModal(true)
  }

  function EmailConnectButton() {
    return (
      <button
        className="flex w-[162px] shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black"
        onClick={handleUpdateEmailClick}
      >
        <Mail size={16} className="mr-2"></Mail>
        Connect Email
      </button>
    )
  }

  function WalletConnectButton() {
    return (
      <button
        onClick={handleWalletConnectClick}
        className="flex w-[162px] shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black"
      >
        <WalletIcon size={16} className="mr-2"></WalletIcon>
        Connect Wallet
      </button>
    )
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <div className="flex w-[338px] flex-col gap-4">
          {emailAccounts?.map((item) => {
            return (
              <EmailAccountItem
                key={item.id}
                account={item}
                onEmailChangeClick={handleUpdateEmailClick}
              ></EmailAccountItem>
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
          <div className="rounded-xl bg-white/10 px-4">
            {walletAccounts?.map((item) => {
              return (
                <WalletAccountItem
                  key={item.account}
                  account={item}
                  canUnbind={info && info?.accounts_data && info?.accounts_data.length > 1}
                ></WalletAccountItem>
              )
            })}
          </div>
        </div>
      </Spin>

      <Modal
        open={showWalletConnectModal}
        onCancel={() => setShowWalletConnectModal(false)}
        onClose={() => setShowWalletConnectModal(false)}
        footer={null}
        width={463}
        centered
        styles={{ content: { padding: 0 } }}
      >
        <CodattaConnect
          onEvmWalletConnect={handleEvmWalletConnect}
          onTonWalletConnect={handleTonWalletConnect}
          onEmailConnect={handleEmailConnect}
          config={connectConfig}
        ></CodattaConnect>
      </Modal>
    </>
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
    </TransitionEffect>
  )
}

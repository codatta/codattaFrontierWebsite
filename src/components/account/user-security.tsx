import { Button, message, Modal, Spin } from 'antd'
import { Mail, Trash, Wallet as WalletIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
import { CodattaConnect, EmvWalletConnectInfo, TonWalletConnectInfo } from 'codatta-connect'

import TaskTarget from '@/components/common/task-target'

import accountApi from '@/apis/account.api'
import { UserAccount } from '@/apis/user.api'

import { userStoreActions, useUserStore } from '@/stores/user.store'

import { shortenAddress } from '@/utils/wallet-address'

function EmailAccountItem(props: { account: UserAccount; onEmailChangeClick: () => void }) {
  const account = props.account

  return (
    <div key={account.id} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2">
      <Mail size={16}></Mail>
      <div className="truncate">{shortenAddress(account.account, 16)}</div>
      {/* <Edit size={24} className="ml-auto shrink-0 cursor-pointer p-1" onClick={props.onEmailChangeClick}></Edit> */}
    </div>
  )
}

function WalletAccountItem(props: { account: UserAccount; canUnbind: boolean | null }) {
  const account = props.account
  const canUnbind = props.canUnbind
  const [loading, setLoading] = useState(false)

  const address = useMemo(() => {
    if (['blockchain', 'wallet', 'block_chain'].includes(account.account_type)) {
      if (['-239', '-3'].includes(account.chain)) {
        return shortenAddress(toUserFriendlyAddress(account.account), 12)
      } else {
        return shortenAddress(account.account, 12)
      }
    }
    return '-'
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
      <div className="w-[120px] capitalize">{account.wallet_name}</div>
      <span>{shortenAddress(address, 12)}</span>
      {canUnbind && (
        <Button type="text" size="small" loading={loading} onClick={handleUnlinkAccount} className="ml-auto">
          {!loading && <Trash size={16}></Trash>}
        </Button>
      )}
    </div>
  )
}

export default function UserSecurity() {
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
    message.success('Email bind success.')
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
        className="flex w-full shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black disabled:cursor-not-allowed"
        onClick={handleUpdateEmailClick}
        disabled={!!info?.user_data?.did}
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
        className="flex w-full shrink-0 items-center rounded-lg bg-white px-4 py-3 font-semibold leading-[19px] text-black disabled:cursor-not-allowed"
        disabled={!!info?.user_data?.did}
      >
        <WalletIcon size={16} className="mr-2"></WalletIcon>
        Connect Wallet
      </button>
    )
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <div className="flex max-w-[390px] flex-col gap-4">
          {emailAccounts?.map((item) => {
            return (
              <EmailAccountItem
                key={item.id}
                account={item}
                onEmailChangeClick={handleUpdateEmailClick}
              ></EmailAccountItem>
            )
          })}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
                  canUnbind={info && info?.accounts_data && info?.accounts_data.length > 1 && !info?.user_data?.did}
                ></WalletAccountItem>
              )
            })}
          </div>
        </div>
      </Spin>

      <Modal
        open={showWalletConnectModal}
        onCancel={() => setShowWalletConnectModal(false)}
        footer={null}
        width={463}
        centered
        styles={{ content: { padding: 0 } }}
        destroyOnClose
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

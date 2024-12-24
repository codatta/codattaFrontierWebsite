// import accountApi from '@/api/account.api'
import userApi, { UserInfo, UserUpdateParams } from '@/apis/user.api'
import { authRedirect } from '@/utils/auth-redirect'
// import CustomAlert from '@/components/account/custom-alert'
// import React, { useState } from 'react'
// import { Button } from 'antd'
// import { createRoot } from 'react-dom/client'
import { shortenAddress } from '@/utils/wallet-address'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
import { derive } from 'derive-valtio'
import { proxy, useSnapshot } from 'valtio'

// const channel = new BroadcastChannel('codatta:social-link')
// const userModalIdObj = {
//   successModal:
//     'user-success-modal-' +
//     window.crypto.getRandomValues(new Uint32Array(1))[0],
//   errorModal:
//     'user-error-modal-' + window.crypto.getRandomValues(new Uint32Array(1))[0]
// }

// function SuccessModal(props: { onClose?: () => void }) {
//   const [show, setShow] = useState(true)

//   return (
//     <CustomAlert
//       title={'Success'}
//       open={show}
//       onClose={() => {
//         props.onClose?.()
//         setShow(false)
//       }}
//     >
//       <div className="mb-4">{'Congratulations, your account has been successfully connected.'}</div>
//       <Button
//         shape="round"
//         block
//         type="primary"
//         className="font-bold py-5"
//         onClick={() => {
//           props.onClose?.()
//           setShow(false)
//         }}
//       >
//         Got it
//       </Button>
//     </CustomAlert>
//   )
// }

// function ErrorModal(props: { message: string | React.ReactNode; onClose?: () => void }) {
//   const [show, setShow] = useState(true)

//   return (
//     <CustomAlert
//       title={'😵Oops!'}
//       open={show}
//       onClose={() => {
//         props.onClose?.()
//         setShow(false)
//       }}
//     >
//       <div className="mb-4">{props.message}</div>
//       <Button
//         shape="round"
//         block
//         type="primary"
//         className="font-bold py-5"
//         onClick={() => {
//           props.onClose?.()
//           setShow(false)
//         }}
//       >
//         Got it
//       </Button>
//     </CustomAlert>
//   )
// }

// function showLinkSuccess(callback?: () => void) {
//   const rootdom = document.createElement('div')
//   rootdom.setAttribute('id', userModalIdObj.successModal)
//   document.body.appendChild(rootdom)
//   const root = createRoot(document.createElement('div'))
//   root.render(<SuccessModal onClose={callback}></SuccessModal>)
// }

// function closeLinkSuccess() {
//   const modalDom = document.getElementById(userModalIdObj.successModal)
//   modalDom && document.body.removeChild(modalDom)
// }

// function showLinkError(message: string | React.ReactNode, callback?: () => void) {
//   const rootdom = document.createElement('div')
//   document.body.appendChild(rootdom)
//   const root = createRoot(document.createElement('div'))
//   root.render(<ErrorModal onClose={callback} message={message}></ErrorModal>)
// }

// function closeLinkError() {
//   const modalDom = document.getElementById(userModalIdObj.errorModal)
//   modalDom && document.body.removeChild(modalDom)
// }

export interface UserStore {
  info: UserInfo | null
}

export const userStore = proxy<UserStore>({
  info: {
    user_data: {
      user_name: '',
      avatar: '',
      referee_code: '',
      user_id: ''
    },
    user_reputation: '',
    user_assets: [],
    accounts_data: []
  }
  // social_account_info: [],
  // accounts: [],
  // username: '-'
})

const derived = derive({
  username: (get) => getUsername(get(userStore).info)
})

function getUsername(info: UserInfo | null) {
  if (!info) return '-'
  if (info.user_data.user_name) return info.user_data.user_name
  const currentAccount = info.accounts_data.find((item) => item.current_account)
  if (!currentAccount) return '-'
  if (['email'].includes(currentAccount.account_type)) {
    return currentAccount.account
  } else if (['blockchain', 'wallet', 'block_chain'].includes(currentAccount.account_type)) {
    if (['codatta_ton', 'ton'].includes(currentAccount.connector)) {
      return shortenAddress(toUserFriendlyAddress(currentAccount.account), 12)
    } else {
      return shortenAddress(currentAccount.account, 12)
    }
  }
  return '-'
}

export function useUserStore() {
  return {
    ...useSnapshot(userStore),
    ...derived
  }
}

async function updateUserInfo(info: UserUpdateParams) {
  await userApi.updateUserInfo(info)
  await getUserInfo()
}

// async function linkDiscord() {
//   try {
//     const { link } = await accountApi.getSocialAccountLinkUrl('Discord')
//     window.open(link, '_blank', 'width=600,height=600')
//   } catch (err: any) {
//     showLinkError(err.message)
//   }
// }

// async function linkX() {
//   try {
//     const { link } = await accountApi.getSocialAccountLinkUrl('X')
//     window.open(link, '_blank', 'width=600,height=600')
//   } catch (err: any) {
//     showLinkError(err.message)
//   }
// }

// async function linkTelegram() {
//   const data = await new Promise<any>((resolve) => {
//     const BOT_ID = import.meta.env.VITE_TG_BOT_ID
//     window.Telegram.Login.auth(
//       { bot_id: BOT_ID, request_access: true },
//       (data) => resolve(data)
//     )
//   })
//   if (!data) return
//   try {
//     const res = await accountApi.linkSocialAccount('Telegram', data)
//     showLinkSuccess(() => channel.postMessage('update'))
//   } catch (err: any) {
//     showLinkError(err.message)
//   }
// }

async function getUserInfo() {
  const { data } = await userApi.getUserInfo()
  userStore.info = data
  // userStore.social_account_info = data.social_account_info
  // userStore.accounts = res.accounts
  return data
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('uid')
  localStorage.removeItem('auth')
  const url = authRedirect()
  window.location.href = url
}

function checkLogin() {
  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  const auth = localStorage.getItem('auth')
  return !!token && !!uid && !!auth
}

export const userStoreActions = {
  // linkDiscord,
  // linkX,
  // linkTelegram,
  updateUserInfo,
  getUserInfo,
  // showLinkSuccess,
  // showLinkError,
  // closeLinkSuccess,
  // closeLinkError
  logout,
  checkLogin
}

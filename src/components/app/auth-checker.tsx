import { userStoreActions } from '@/stores/user.store'
import { authRedirect } from '@/utils/auth-redirect'
// import { useCodattaConnectContext } from 'codatta-connect'
// import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export default function ExtensionChecker(props: { children: React.ReactNode }) {
  const isLogin = userStoreActions.checkLogin()

  if (isLogin) return <>{props.children}</>
  else {
    const url = authRedirect()
    return <Navigate to={url}></Navigate>
  }
}

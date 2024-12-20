import { authRedirect } from '@/utils/auth-redirect'

export function logout() {
  const url = authRedirect()
  window.location.href = url
}

export function checkLogin() {
  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  const auth = localStorage.getItem('auth')
  return !!token && !!uid && !!auth
}

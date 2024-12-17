export function authRedirect() {
  localStorage.removeItem('token')
  localStorage.removeItem('uid')
  localStorage.removeItem('auth')

  const url = new URL(window.location.href)
  const from = url.pathname + url.search
  const redirect = `/account/signin?from=${encodeURIComponent(from)}`
  return redirect
}

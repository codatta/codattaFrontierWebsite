import cookies from 'js-cookie'
const CHANNEL_KEY = '_ch'

export function getChannelCode() {
  const querystirng = new URLSearchParams(location?.search)

  // 这里处理了渠道相关的逻辑。如果url中有渠道信息，则渠道信息直接写到cookie中，否则从cookie中读取。
  const cookieChannelCode = cookies.get(CHANNEL_KEY)
  const queryChannelCode = querystirng.get(CHANNEL_KEY) || ''

  if (queryChannelCode) {
    cookies.set(CHANNEL_KEY, queryChannelCode, { expires: 365 })
  }

  return queryChannelCode || cookieChannelCode
}

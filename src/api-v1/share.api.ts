// import request from '@/api'

// class ShareApi {
//   async getShareLink(type: ShareType, id: string, channel: string = 'link', inviterCode?: string) {
//     const {
//       data: { link, source_type, source_id, share_id },
//     } = await request.post<ShareLinkDTO>('/share/link', {
//       source_type: shareTypeSourceTypeMap[type],
//       source_id: id,
//       share_channel: channel.toUpperCase(),
//     })
//     const url = new URL(`${link}/${shareTypeURLMap[source_type]}/${source_id}`)
//     url.searchParams.set('_ch', socialCodeMap[channel.toLowerCase()] ?? SocialCode.Link)
//     url.searchParams.set('share_id', share_id)
//     url.searchParams.set('_ic', inviterCode)
//     return url
//   }
// }

// const shareApi = new ShareApi()
// export default shareApi

// export enum ShareType {
//   Validation = 'VALIDATION',
//   BountyAddress = 'BOUNTY_ADDRESS',
//   BountyEntity = 'BOUNTY_ENTITY',
//   Submission = 'SUBMISSION'
// }

// export interface ShareLinkDTO {
//   source_id: string
//   source_type: ShareType
//   share_id: string
//   link: string
// }

// const shareTypeSourceTypeMap = {
//   [ShareType.Validation]: 'VALIDATION',
//   [ShareType.BountyAddress]: 'BOUNTY_ADDRESS',
//   [ShareType.BountyEntity]: 'BOUNTY_ENTITY',
//   [ShareType.Submission]: 'VALIDATION'
// }

// const shareTypeURLMap = {
//   [ShareType.Validation]: 'validation',
//   [ShareType.BountyAddress]: 'hunting/address',
//   [ShareType.BountyEntity]: 'hunting/entity',
//   [ShareType.Submission]: 'submission'
// }

// export enum SocialCode {
//   Link,
//   Telegram,
//   Twitter
// }

export enum Social {
  Link = '',
  Telegram = 'telegram',
  Twitter = 'twitter'
}

// export const socialCodeMap = {
//   [Social.Link]: SocialCode.Link,
//   [Social.Telegram]: SocialCode.Telegram,
//   [Social.Twitter]: SocialCode.Twitter
// }

import request, { type Response } from './request'

class CardApi {
  async getAnnouncement() {
    const res = await request.get<Response<IAnnouncement[]>>('/card/info', {
      params: { card_type: 'announcement' }
    })
    return res.data
  }

  async getKeyFeatures() {
    const res = await request.get<Response<IKeyFeatures[]>>('/card/info', {
      params: { card_type: 'key_features' }
    })
    return res.data
  }
}

const cardApi = new CardApi()

export default cardApi

export interface IExtInfo {
  image: string
  desc: string
  title: string
  schema: string
  status: string
  subDesc: string
  subTitle: string
  backgroundColor: string
  backgroundPosition: string
}

export interface IAnnouncement {
  name: string
  desc: string
  ext_info: IExtInfo
}

export interface IKeyFeatures {
  name: string
  desc: string
  ext_info: IExtInfo
}

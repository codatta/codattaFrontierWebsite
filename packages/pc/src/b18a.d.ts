/**
 * 这里主要对接口的返回数据进行定义，以确保接口返回的数据类型正确
 * 另外基础的数据结构也可以在这里进行补充。
 * 其他的
 */

namespace B18A {
  interface Response<T> {
    data: T
    success: boolean
    errorCode: number
    errorMessage: string
  }

  type DashboardResponse = {
    contribution_user_count: number
    contribution_address_count: number
    validation_user_count: number
    rewards_count: number
    hunting_count: number
    network_num: number
    category_num: number
    address_num: number
    entity_num: number
    top_cate_num: { cat: string; cnt: number; order: number }[]
  }
}

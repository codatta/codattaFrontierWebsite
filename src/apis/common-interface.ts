export interface PaginationParam {
  page: number
  page_size: number
}

export type PaginationResponse<T> = {
  data: T
  total_count: number
  total_page: number
}

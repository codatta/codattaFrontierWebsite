import { AxiosInstance } from 'axios'
import request, { PaginationResponse, TPagination } from './request'

interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

export interface TaskRewardInfo {
  reward_icon: string
  reward_mode: string
  reward_type: string
  reward_value: number
}

export interface TaskDetail {
  frontier_id: string
  task_id: string
  name: string
  create_time: number
  submission_id: string
  task_type: string
  data_display: {
    gif_resource: string
    template_id: string
  }
  questions?: CMUDataRequirements[]
  question_status?: number // 1: available, 2: no more questions, 3. need to change question group
  data_requirements: unknown
  reward_info: readonly TaskRewardInfo[]
  status: string
  txHashUrl: string
}

export interface ExploreFrontierItem {
  creator_id: string
  description: {
    frontier_desc: string
  }
  frontier_id: string
  logo_url: string
  reputation_permission: number
  status: string
  title: string
  template_ext?: {
    template_id: string
    gif_resource?: string
    open_cum_dialog?: number
  }
}

export enum MediaName {
  TWITTER = 'x',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
  WEBSITE = 'website',
  DOC = 'doc'
}

export interface VideoItem {
  video_id: string
  desc?: string
  image_url?: string
  video_url: string
}

export interface FrontierItemType {
  id?: number
  name: string
  description: string
  logo_url: string
  banner?: string
  media_link?: Array<{
    name: MediaName
    value: string
  }>
  videos?: Array<VideoItem>
  reputation_permission?: number
  frontier_id?: string
}

export interface CMUDataRequirements {
  num: string
  queryText: string
  status: number // 2: finished, other: not finished
  part1: {
    select?: string
    videos: Array<VideoItem>
  }
  part2: {
    videos: Array<VideoItem>
    questions: Array<{
      title: string
      select?: string
      options: Array<{
        value: string
        label: string
        content: string
      }>
    }>
  }
}

class frontier {
  constructor(private request: AxiosInstance) {}

  async getTaskDetail(taskId: string) {
    const res = await this.request.post<Response<TaskDetail>>('/v2/frontier/task/detail', { task_id: taskId })
    // return res.data

    return {
      data: {
        frontier_id: '7219886487300100819',
        task_id: '7227058050400100824',
        asset_info: null,
        name: 'CMU test 44',
        data_display: {
          template_id: 'CMU_TPL_000001',
          open_cum_dialog: 1
        },
        data_requirements: {},
        reward_info: [
          {
            reward_icon: 'https://static.codatta.io/static/images/23910bf5647f1d35fa92e6b1688f5869e8335f16.png',
            reward_mode: 'DYNAMIC',
            reward_type: 'POINTS',
            reward_value: 3
          },
          {
            reward_icon: 'https://static.codatta.io/static/images/23910bf5647f1d35fa92e6b1688f5869e8335f16.png',
            reward_mode: 'REGULAR',
            reward_type: 'POINTS',
            reward_value: 6
          }
        ],
        status: 'COLLECTING',
        question_status: 1,
        questions: [
          {
            num: '000101',
            queryText: 'lkjasdf aslkdfj alskdjf laksj dfklj',
            status: 0, // 2: finished, other: not finished
            part1: {
              videos: [
                {
                  video_id: 'CV_q00A_02',
                  video_url: 'https://static.codatta.io/cmu/videos/CV_q00A_02.mp4'
                  // video_url: 'https://xxx.bbb.ccc/aa'
                },
                {
                  video_id: 'CV_q01A_00',
                  video_url: 'https://static.codatta.io/cmu/videos/CV_q01A_00.mp4'
                  // video_url: 'https://xxx.bbb.ccc/aa'
                }
              ]
            },
            part2: {
              videos: [
                {
                  video_id: 'CV_q00A_02',
                  // image_url: 'https://xxx.bbb.ccc/aa',
                  video_url: 'https://static.codatta.io/cmu/videos/CV_q00A_02.mp4'
                }
              ],
              questions: [
                {
                  title: 'akhjaelkj123lkjasd',
                  options: [
                    {
                      value: '1',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    },
                    {
                      value: '2',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    },
                    {
                      value: '3',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    },
                    {
                      value: '4',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    }
                  ]
                },
                {
                  title: 'bjkjbjbjbkjbkjbkj',
                  options: [
                    {
                      value: '2',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    },
                    {
                      value: '3',
                      label: 'jhjakdfjlj',
                      content: 'alksdjfalksjdflakjdfs'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  }

  async submitTask(taskId: string, data: object) {
    const res = await this.request.post<Response<null>>('/v2/frontier/task/submit', {
      task_id: taskId,
      data_submission: data
    })
    return res.data
  }

  async getTaskList(params: {
    frontier_id: string
    page_num: number
    page_size: number
  }): Promise<PaginationResponse<TaskDetail[]>> {
    const res = await this.request.post('/v2/frontier/task/list', params)
    return res.data
  }

  async getSubmissionList(
    data: TPagination & {
      frontier_id?: string
    }
  ): Promise<PaginationResponse<TaskDetail[]>> {
    const res = await this.request.post('/v2/submission/list', data)
    return res.data
  }

  async getFrontiers(): Promise<Response<ExploreFrontierItem[]>> {
    const res = await this.request.post('/v2/frontier/list ')
    return res.data
  }

  async getFrontierInfo(frontier_id: string): Promise<Response<FrontierItemType>> {
    const res = await this.request.get(`/v2/frontier/info?frontier_id=${frontier_id}`)
    console.log(res)
    return res.data
  }
}

export default new frontier(request)

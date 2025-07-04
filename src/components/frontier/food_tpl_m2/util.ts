import frontiterApi from '@/apis/frontiter.api'

async function getLastSubmission(frontierId: string) {
  const res = await frontiterApi.getSubmissionList({ page_num: 1, page_size: 1, frontier_id: frontierId })
  const lastSubmission = res.data[0]
  return lastSubmission
}

async function checkTaskBasicInfo(taskId: string, templateId: string) {
  const res = await frontiterApi.getTaskDetail(taskId)
  const { data_display } = res.data
  if (data_display.template_id !== templateId) {
    console.log(data_display.template_id, templateId)
    throw new Error('Template not match!')
  }
  return res.data
}

export async function checkTaskStatus(taskId: string, templateId: string) {
  if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
  const taskDetail = await checkTaskBasicInfo(taskId, templateId)
  const lastSubmission = await getLastSubmission(taskDetail.frontier_id)

  return lastSubmission
}

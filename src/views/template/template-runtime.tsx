import frontierApi from '@/apis/frontiter.api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { registerRemotes, loadRemote } from '@module-federation/runtime'
import { message } from 'antd'

export default function TemplateRuntime() {
  const { taskId, templateId } = useParams()
  const [loading, setLoading] = useState(true)
  const [Template, setTemplate] = useState<React.ComponentType>()

  async function initTemplate(taskId: string) {
    setLoading(true)
    const taskDetail = await frontierApi.getTaskDetail(taskId)
    const webTemplateUrl = taskDetail.data.data_display.web_template_url!
    const appTemplateUrl = taskDetail.data.data_display.app_template_url!
    const templateId = taskDetail.data.template_id

    const userAgent = navigator.userAgent
    const isInApp = /codatta/i.test(userAgent)

    const templateUrl = isInApp ? appTemplateUrl : webTemplateUrl
    if (templateUrl) {
      message.error('Template not found! or not supported in this platform!')
      return
    }

    try {
      registerRemotes([{ name: templateId, entry: templateUrl }])
      const moduleId = `${templateId}/index`
      const module = (await loadRemote(moduleId)) as { default: React.ComponentType }
      if (!module) {
        throw new Error('Template not found! or not supported in this platform!')
      }
      const template = module.default
      setTemplate(template)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!taskId || !templateId) return
    initTemplate(taskId)
  }, [taskId, templateId])

  return <>{loading ? <div>Loading...</div> : <>{Template && <Template />}</>}</>
}

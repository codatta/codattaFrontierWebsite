import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { message } from 'antd'
import frontiterApi from '@/apis/frontiter.api'

const scriptLoadingCache = new Map<string, Promise<void>>()

type TemplateRuntimeRouteState = {
  template_url?: string
  template_tag?: string
  template_id?: string
}

function loadScriptOnce(jsUrl: string) {
  const cached = scriptLoadingCache.get(jsUrl)
  if (cached) {
    return cached
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-template-src="${jsUrl}"]`) as HTMLScriptElement | null
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load template script: ${jsUrl}`)), {
        once: true
      })
      return
    }

    const script = document.createElement('script')
    script.src = jsUrl
    script.async = true
    script.dataset.templateSrc = jsUrl
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true }
    )
    script.addEventListener('error', () => reject(new Error(`Failed to load template script: ${jsUrl}`)), {
      once: true
    })
    document.head.appendChild(script)
  })

  scriptLoadingCache.set(jsUrl, promise)
  return promise
}

async function waitForCustomElement(tagName: string, timeout = 15000) {
  if (customElements.get(tagName)) {
    return
  }

  await Promise.race([
    customElements.whenDefined(tagName),
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(`Custom element not registered in time: ${tagName}`)), timeout)
    })
  ])
}

export default function TemplateRuntime() {
  const { taskId, templateId: routeTemplateId } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const routeState = (location.state as TemplateRuntimeRouteState | null) ?? null

  async function initTemplate(currentTaskId: string) {
    setLoading(true)
    setError(null)

    let jsUrl = routeState?.template_url
    let tagName = routeState?.template_tag
    let templateId = routeState?.template_id || routeTemplateId

    if (!jsUrl || !tagName) {
      try {
        const res = await frontiterApi.getTaskDetail(currentTaskId)
        const taskDetail = res.data
        jsUrl = taskDetail.data_display.template_url
        tagName = taskDetail.data_display.template_tag
        templateId = taskDetail.template_id || taskDetail.data_display.template_id
      } catch (err) {
        const msg = (err as Error)?.message || 'Failed to load task detail'
        setError(msg)
        message.error(msg)
        setLoading(false)
        return
      }
    }

    if (!jsUrl || !tagName) {
      const msg = 'Template configuration is missing (template_url or template_tag)'
      setError(msg)
      message.error(msg)
      setLoading(false)
      return
    }

    const mountNode = mountRef.current
    if (!mountNode) {
      setLoading(false)
      return
    }

    let element: HTMLElement | null = null
    const onReady = () => {
      setLoading(false)
    }
    const onError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>
      const msg = customEvent.detail?.message || 'Template render failed'
      message.error(msg)
      setLoading(false)
    }

    try {
      await loadScriptOnce(jsUrl)
      await waitForCustomElement(tagName)

      element = document.createElement(tagName)
      const el = element
      el.setAttribute('task-id', currentTaskId)
      if (templateId) {
        el.setAttribute('template-id', templateId)
      }
      ;(el as HTMLElement & { taskId?: string }).taskId = currentTaskId

      el.addEventListener('template:ready', onReady)
      el.addEventListener('template:error', onError)

      mountNode.innerHTML = ''
      mountNode.appendChild(el)
      setLoading(false)
    } catch (err) {
      const msg = (err as Error)?.message || 'Template init failed'
      message.error(msg)
      setError(msg)
      setLoading(false)
    }

    return () => {
      if (element) {
        element.removeEventListener('template:ready', onReady)
        element.removeEventListener('template:error', onError)
      }
      if (element && mountNode.contains(element)) {
        mountNode.removeChild(element)
      }
    }
  }

  useEffect(() => {
    if (!taskId) {
      setError('Missing taskId')
      setLoading(false)
      return
    }

    let dispose: (() => void) | undefined
    initTemplate(taskId).then((cleanup) => {
      dispose = cleanup
    })

    return () => {
      dispose?.()
    }
  }, [routeState?.template_id, routeState?.template_tag, routeState?.template_url, routeTemplateId, taskId])

  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error && !loading ? <div>{error}</div> : null}
      <div ref={mountRef} />
    </>
  )
}

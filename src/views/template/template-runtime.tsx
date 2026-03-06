import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

type TemplateScriptConfig = {
  version: string
  jsUrl: string
  tagName: string
}

const TEMPLATE_SCRIPT_MAP: Record<string, TemplateScriptConfig> = {
  'example-001': {
    version: '20260228.095732',
    jsUrl: 'https://static.codatta.io/templates/example-001/version/20260302.095805/index.js',
    tagName: 'codatta-template'
  }
}

const scriptLoadingCache = new Map<string, Promise<void>>()

function normalizeTagPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getTemplateTagName(templateId: string, version: string) {
  const id = normalizeTagPart(templateId)
  const ver = normalizeTagPart(version)
  return `codatta-template-${id}-v-${ver}`
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
  const { taskId, templateId } = useParams()
  const [loading, setLoading] = useState(true)
  const mountRef = useRef<HTMLDivElement>(null)

  async function initTemplate(currentTemplateId: string, currentTaskId: string) {
    setLoading(true)
    const config = TEMPLATE_SCRIPT_MAP[currentTemplateId]
    if (!config) {
      message.error('Template not found! or not supported in this platform!')
      setLoading(false)
      return
    }

    const tagName = config.tagName || getTemplateTagName(currentTemplateId, config.version)
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
      message.error(customEvent.detail?.message || 'Template render failed')
      setLoading(false)
    }

    try {
      await loadScriptOnce(config.jsUrl)
      await waitForCustomElement(tagName)

      element = document.createElement(tagName)
      element.setAttribute('task-id', currentTaskId)
      element.setAttribute('template-id', currentTemplateId)
      element.setAttribute('template-version', config.version)
      ;(element as HTMLElement & { taskId?: string; templateId?: string }).taskId = currentTaskId
      ;(element as HTMLElement & { taskId?: string; templateId?: string }).templateId = currentTemplateId

      element.addEventListener('template:ready', onReady)
      element.addEventListener('template:error', onError)

      mountNode.innerHTML = ''
      mountNode.appendChild(element)
      setLoading(false)
    } catch (err) {
      const error = err as Error
      message.error(error.message || 'Template init failed')
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
    if (!taskId || !templateId) {
      setLoading(false)
      return
    }

    const runtimeTemplateId = templateId in TEMPLATE_SCRIPT_MAP ? templateId : 'example-001'

    let dispose: (() => void) | undefined
    initTemplate(runtimeTemplateId, taskId).then((cleanup) => {
      dispose = cleanup
    })

    return () => {
      dispose?.()
    }
  }, [taskId, templateId])

  return (
    <>
      {loading ? <div>Loading...</div> : null}
      <div ref={mountRef} />
    </>
  )
}

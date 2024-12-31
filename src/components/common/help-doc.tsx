import { marked, RendererObject, Tokens } from 'marked'
import { useEffect, useState } from 'react'
import '@/styles/codatta-help-doc.css'

import DOCS_MAP from './help-doc.data'

// rewrite marked link renderer
const renderer: RendererObject = {
  link(token: Tokens.Link) {
    return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${token.text}</a>`
  },
  image(token: Tokens.Image) {
    return `<a href="${token.href}" target="_blank" rel="noopener noreferrer"><img src="${token.href}" alt="${token.text}" /></a>`
  }
}

marked.use({ renderer })

export async function getDoc(key: string) {
  // check key exists
  // get module from DOCS_MAP ignore case
  let module = DOCS_MAP[key.toLowerCase()]
  if (!module) module = DOCS_MAP['known-address']
  // load module
  const doc = await module
  if (!doc) throw new Error('doc not found')

  // get content
  const res = await fetch(doc.default)
  const content = await res.text()
  return content
}

export default function HelpDoc(props: { docKey: string; className?: string }) {
  const { docKey, className } = props
  const [html, setHtml] = useState('')

  async function renderDoc(key: string) {
    const doc = await getDoc(key)
    const html = marked.parse(doc) as string
    setHtml(html)
  }

  useEffect(() => {
    if (!docKey) return
    renderDoc(docKey)
  }, [docKey])

  return <div id="codatta-doc-container" className={className} dangerouslySetInnerHTML={{ __html: html }}></div>
}

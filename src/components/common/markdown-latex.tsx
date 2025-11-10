import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface MarkdownLatexProps {
  children?: string
  className?: string
  // Edit mode configuration
  editable?: boolean
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  // Preview layout: 'side' (split left-right) | 'bottom' (split top-bottom) | 'tabs' (tab switching)
  previewLayout?: 'side' | 'bottom' | 'tabs'
  // Editor height
  editorHeight?: string
  // Show character count
  showCount?: boolean
  maxLength?: number
}

/**
 * Markdown component with LaTeX formula support
 *
 * Usage:
 *
 * 1. Preview only mode:
 * ```tsx
 * <MarkdownLatex>
 *   {`# Title
 *   Inline formula: $E = mc^2$
 *   `}
 * </MarkdownLatex>
 * ```
 *
 * 2. Edit-preview mode (side-by-side):
 * ```tsx
 * <MarkdownLatex
 *   editable
 *   value={text}
 *   onChange={setText}
 *   previewLayout="side"
 * />
 * ```
 *
 * 3. Edit-preview mode (top-bottom):
 * ```tsx
 * <MarkdownLatex
 *   editable
 *   value={text}
 *   onChange={setText}
 *   previewLayout="bottom"
 *   showCount
 *   maxLength={500}
 * />
 * ```
 */
export default function MarkdownLatex({
  children,
  className,
  editable = false,
  value,
  onChange,
  placeholder = 'Enter markdown text with LaTeX support...',
  previewLayout = 'side',
  editorHeight = '400px',
  showCount = false,
  maxLength
}: MarkdownLatexProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const displayContent = editable ? (value ?? '') : (children ?? '')

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-3 text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 text-lg font-semibold">{children}</h3>,
        p: ({ children }) => <p className="mb-2">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal pl-5">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code: ({ children, className }) => {
          const isInline = !className
          return isInline ? (
            <code className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800">{children}</code>
          ) : (
            <code className={className}>{children}</code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">{children}</pre>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-500 underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-600 dark:text-gray-400">
            {children}
          </blockquote>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )

  // Preview only mode
  if (!editable) {
    return <div className={className}>{renderMarkdown(displayContent)}</div>
  }

  // Editable mode with different layouts
  if (previewLayout === 'tabs') {
    return (
      <div className={className}>
        <div className="mb-2 flex gap-2 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 font-semibold text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 font-semibold text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Preview
          </button>
        </div>
        {activeTab === 'edit' ? (
          <div className="relative">
            <textarea
              value={displayContent}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              className="w-full resize-none rounded-lg border border-gray-300 bg-transparent p-3 pb-8 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700"
              style={{ height: editorHeight }}
            />
            {showCount && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                {displayContent.length}
                {maxLength && ` / ${maxLength}`}
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[200px] rounded-lg border border-gray-300 p-4 dark:border-gray-700">
            {renderMarkdown(displayContent)}
          </div>
        )}
      </div>
    )
  }

  // Side-by-side or top-bottom layout
  const isSideLayout = previewLayout === 'side'
  const containerClass = isSideLayout ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'

  return (
    <div className={className}>
      <div className={containerClass}>
        <div className="relative">
          <textarea
            value={displayContent}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full resize-none rounded-lg border border-gray-300 bg-transparent p-3 pb-8 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700"
            style={{ height: editorHeight }}
          />
          {showCount && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {displayContent.length}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
        <div
          className="overflow-y-auto rounded-lg border border-gray-300 p-4 dark:border-gray-700"
          style={{ height: editorHeight }}
        >
          {renderMarkdown(displayContent || placeholder)}
        </div>
      </div>
    </div>
  )
}

import Markdown from 'react-markdown'

export default function FrontierActivityMarkdown(props: { children: string }) {
  return (
    <Markdown
      components={{
        a: ({ children, href }) => (
          <a href={href} className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        h1: ({ children }) => <h1 className="text-2xl font-bold text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold text-white">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold text-white">{children}</h4>,
        h5: ({ children }) => <h5 className="text-sm font-bold text-white">{children}</h5>,
        h6: ({ children }) => <h6 className="text-xs font-bold text-white">{children}</h6>,
        p: ({ children }) => <p className="my-2 text-sm">{children}</p>,
        ul: ({ children }) => <ul className="my-2 list-disc pl-4">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal pl-4">{children}</ol>,
        li: ({ children }) => <li className="my-2 text-sm">{children}</li>,
        hr: () => <hr className="my-4 border-t border-white/20" />
      }}
    >
      {props.children}
    </Markdown>
  )
}

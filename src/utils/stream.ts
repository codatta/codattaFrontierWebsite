const MD_SIGNATURES = [
  /#{1,6}\s.+?\n/g,
  /```[\s\S]+?```/g,
  /^(\s*[-*+]|\d+\.)\s.+/gm,
  /^(\s*[-*+]|\d+\.)\s/,
  /```[\s\S]*?```/,
  /^\|.+\|.+/gm
]

export const isMarkdownFn = (text: string) => MD_SIGNATURES.some((regex) => regex.test(text))

import { ReactNode } from 'react'

export default function PageError(props: { error: string | ReactNode }) {
  const { error } = props
  return <div>{error}</div>
}

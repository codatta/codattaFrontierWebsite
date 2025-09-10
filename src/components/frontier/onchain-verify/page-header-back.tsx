function BackIcon({ onClick }: { onClick: () => void }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={onClick}>
      <path
        d="M10.8284 12.0046L15.7782 16.9543L14.364 18.3685L8 12.0046L14.364 5.64062L15.7782 7.05483L10.8284 12.0046Z"
        fill="#77777D"
      />
    </svg>
  )
}

export default function PageHeader(props: { title: string; onBack: () => void }) {
  const { title } = props

  function handleBackClick() {
    props.onBack()
  }

  return (
    <div className="flex items-center justify-start gap-3 px-6 py-4">
      <BackIcon onClick={handleBackClick} />
      <h1 className="text-base font-bold">{title}</h1>
    </div>
  )
}

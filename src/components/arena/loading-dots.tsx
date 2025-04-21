export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="size-2 animate-dot-expand rounded-full bg-primary animate-delay-0" />
      <div className="size-2 animate-dot-expand rounded-full bg-primary animate-delay-500" />
      <div className="size-2 animate-dot-expand rounded-full bg-primary animate-delay-1000" />
    </div>
  )
}

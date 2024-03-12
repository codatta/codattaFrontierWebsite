import './Bg.scss'

export default function Bg() {
  return (
    <div className="page-bg absolute right-0 top-0 pointer-events-none z--1">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className={`img img${index + 1}`} key={`bg-img-${index}`} />
      ))}
    </div>
  )
}

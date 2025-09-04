export default function PageHeader(props: { title: string }) {
  return (
    <div>
      <h1 className="mx-auto flex items-center justify-center p-4 text-center text-base font-bold">{props.title}</h1>
    </div>
  )
}

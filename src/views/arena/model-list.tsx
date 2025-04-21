import { useArenaStore } from '@/stores/arena.store'

export default function ModelList() {
  const { modelList } = useArenaStore()

  return (
    <div className="py-8">
      <h1 className="mb-2 text-3xl font-bold">Model List</h1>
      <p className="mb-10 text-base text-white/60">Explore our collection of AI models</p>
      <table>
        <tbody>
          {modelList.map((model) => (
            <tr key={model.name} className="border-b border-white/10">
              <td className="whitespace-nowrap py-3 pr-10 align-top font-bold">{model.show_name}</td>
              <td className="py-3 text-white/60">{model.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

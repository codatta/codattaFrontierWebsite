import RadioCard from './radio-card'

export default function EnvironmentCard() {
  const options = [
    { value: 'Indoor', label: 'Indoor' },
    { value: 'Outdoor', label: 'Outdoor' },
    { value: 'Office', label: 'Office' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Bedroom', label: 'Bedroom' },
    { value: 'Factory', label: 'Factory' },
    { value: 'Other', label: 'Other' }
  ]
  return (
    <RadioCard
      name="environment"
      options={options}
      title="Environment"
      des="Describe the environment depicted in the material."
      className="rounded-2xl bg-[#252532] p-6"
    />
  )
}

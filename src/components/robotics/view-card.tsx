import ChoicesCard from './choices-card'

export default function ViewCard() {
  const options = [
    { value: 'first_persion_view', label: 'first_persion_view' },
    { value: 'third_person_view', label: 'third_person_view' },
    { value: 'bird_eye_view', label: 'bird_eye_view' },
    { value: 'static', label: 'static' },
    { value: 'dynamic', label: 'dynamic' }
  ]
  return (
    <ChoicesCard
      name="view"
      title="View"
      des="Select the shooting angles of the material(multiple choices)"
      options={options}
    />
  )
}

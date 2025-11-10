const NOTES = [
  'Accepted contributions will receive standard compensation.',
  'All submissions undergo rigorous review. Questions not meeting the stated criteria will be rejected.'
]

export default function SubmissionNotes() {
  return (
    <div className="bg-[#875DFF0A]">
      <div className="mx-auto max-w-[1352px] px-10 py-[30px]">
        <h3 className="text-lg font-bold text-[#875DFF]">Submission Notes</h3>
        <ul className="mt-4 list-inside list-disc text-sm leading-[22px] text-[#BBBBBE]">
          {NOTES.map((note, index) => (
            <li key={'note_' + index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

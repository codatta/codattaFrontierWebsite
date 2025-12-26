export default function Guideline() {
  const list = {
    task_description: {
      des: (
        <>
          This task involves annotating appliance knobs from photos. You will upload a front-facing photo of a knob,
          draw a red rectangle around the knob's outer contour, mark the pointer position with a brown dot, and enter
          the scale value indicated by the pointer. Accurate annotations help build a high-quality dataset for knob
          recognition and analysis.
        </>
      )
    },
    requirements: {
      des: 'Please follow these requirements to ensure your submission meets quality standards:',
      list: [
        'Photo must clearly and completely contain the knob',
        'Non-AI generated photos only',
        'Must be front-facing view',
        'Each image must contain exactly one knob',
        'Knob must be centered in the photo',
        'Scale markings around the knob must be in Chinese, English, or numbers, not just icons'
      ]
    }
  }

  return (
    <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
      <h2 className="text-lg font-bold text-white">
        <span>📋 Guidelines</span>
      </h2>
      <h3 className="mb-2 mt-4 font-semibold text-white">📋 Task Description </h3>
      <p className="mt-2 leading-[22px]">{list.task_description.des}</p>
      <h3 className="mb-2 mt-3 font-semibold text-white">📝 Requirements (Must Read)</h3>
      <p className="mt-2 leading-[22px]">{list.requirements.des}</p>
      <ul className="mt-2 list-none pl-0 leading-[22px]">
        {list.requirements.list.map((req, idx) => (
          <li key={idx} className="relative pl-6">
            <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
            {req}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const ExpertRedline = () => {
  const list = [
    'Maliciously circumventing or cracking task rules; submitting a large amount of invalid or low-quality data',
    'Engaging in obvious cheating behavior by directly submitting AI-generated content without performing any manual review, modification, or annotation',
    'Engaging in dishonest behaviors such as plagiarism or delegating tasks to others',
    'Engaging in uncivilized behaviors such as verbal abuse or personal attacks against others',
    'Disseminating question banks or task rules, or disclosing any related confidential information'
  ]
  return (
    <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
      <h2 className="text-lg font-bold text-[#FFA800]">⚠️ Expert Redline Behaviors (One-time Elimination System)</h2>
      <p className="mt-4 text-[#BBBBBE]">
        Please strictly adhere to the following rules. If any redline behavior is determined by the business, expert
        qualifications will be immediately revoked, and all unsettled data will not be paid for:
      </p>
      <ul className="mt-3 list-inside list-decimal text-[#8D8D93]">
        {list.map((item, index) => (
          <li key={`redline-${index}`}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 font-semibold text-[#BBBBBE]">
        📋 Please also note that if any malicious activity is detected, all submitted data from the account will be
        invalidated, and the account will be blacklisted, preventing any new data submissions for 14 days.
      </p>
    </div>
  )
}

import { Flag } from 'lucide-react'

export default function Guideline() {
  const list = {
    criteria: {
      title: 'Question Criteria:',
      list: [
        'Comprehensive Analysis: Provide thorough analysis of the question, considering all relevant aspects and potential approaches.',
        'Clear Structure: Organize your answer with clear headings, bullet points, and logical flow.',
        'Evidence-Based: Support your arguments with concrete examples, data, or references where applicable.',
        'Practical Application: Include practical implications and real-world applications of your answer.'
      ]
    },
    standards: {
      title: 'Evaluation Standards:',
      list: [
        'Accuracy: Ensure all information provided is factually correct and up-to-date.',
        'Completeness: Address all parts of the question comprehensively.',
        'Clarity: Use clear, concise language that is easy to understand.',
        'Originality: Provide original insights and avoid generic responses.'
      ]
    },
    note: 'Note: Focus on providing value through detailed, well-reasoned responses that demonstrate deep understanding of the subject matter.'
  }

  return (
    <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
      <h2 className="text-lg font-bold text-white">
        <span>💡 Answering Approach</span>
      </h2>
      <h3 className="mb-2 mt-4 font-semibold text-white">{list.criteria.title}</h3>
      <ol className="list-inside list-decimal">
        {list.criteria.list.map((item, index) => (
          <li key={`criteria-${index}`}>{item}</li>
        ))}
      </ol>
      <h3 className="mb-2 mt-3 font-semibold text-white">{list.standards.title}</h3>
      <ul className="list-inside list-disc">
        {list.standards.list.map((item, index) => (
          <li key={`standards-${index}`}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-1">
        <Flag className="size-[14px]" />
        {list.note}
      </p>
    </div>
  )
}

export const ExpertRedline = () => {
  const list = [
    'Maliciously circumventing or cracking task rules, submitting a large amount of invalid data, or falsely reporting task duration (including time-based and fixed-price tasks);',
    'Engaging in obvious cheating behavior, directly submitting AI-generated content, and failing to perform any manual review, modification, or annotation;',
    "Maliciously claiming tasks, massively claiming tasks outside one's professional field;",
    'Engaging in dishonest behaviors such as plagiarism or delegating tasks to others;',
    'Engaging in uncivilized behaviors such as verbal abuse or personal attacks against others;',
    'Disseminating question banks or task rules, or disclosing any related private information.'
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
    </div>
  )
}

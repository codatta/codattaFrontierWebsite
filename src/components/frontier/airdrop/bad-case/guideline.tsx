import { Flag } from 'lucide-react'

export default function Guideline() {
  const list = {
    criteria: {
      title: 'Question Criteria:',
      list: [
        'High Difficulty: Questions should challenge models like Doubao (deep thinking) and Yuanbao DeepSeek R1 (deep thinking + internet) to the point where they are "unusable" - approximately 60% distance from ideal answers, with less than 40% satisfaction of ideal knowledge points.',
        'Correctness: Ensure fair assessment of model capabilities. Repeatedly check question logic for correctness and clarity of expression.',
        'Originality: Prohibit using existing questions from the internet. Create your own questions. Cheating will result in disqualification.',
        'Open-ended: Questions must be open-ended, disallowing questions with single, definite answers.'
      ]
    },
    standards: {
      title: 'If you need inspiration, consider these approaches:',
      list: [
        'Approach One: Treat the large model as a student and yourself as a teacher testing its abilities. Leverage your industry and professional knowledge to explore the model\'s capability boundaries. Note that the "student" has internet search capabilities, so questions should not be easily searchable.',
        'Approach Two: Use the large model as an assistant to solve difficult problems in your professional or daily life. Provide detailed content, background, and clearly state your needs to the model.'
      ]
    },
    note: 'Note: Creative field experts are required to use Approach Two for question creation.'
  }

  return (
    <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
      <h2 className="text-lg font-bold text-white">
        <span>📋 Question Requirements</span>
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
    'Maliciously circumventing or cracking task rules, submitting a large amount of invalid data, or falsely reporting task duration (including time-based and fixed-price tasks)',
    'Engaging in obvious cheating behavior, directly submitting AI-generated content, and failing to perform any manual review, modification, or annotation',
    "Maliciously claiming tasks, massively claiming tasks outside one's professional field",
    'Engaging in dishonest behaviors such as plagiarism or delegating tasks to others',
    'Engaging in uncivilized behaviors such as verbal abuse or personal attacks against others',
    'Disseminating question banks or task rules, or disclosing any related private information'
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

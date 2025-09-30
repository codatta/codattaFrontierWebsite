export default function Guideline() {
  const list = {
    task_description: {
      des: (
        <>
          This project aims to discover and correct specific errors made by large models when answering objective
          questions. You are required to submit an objective question, an incorrect answer from an AI model (text +
          screenshot), and directly provide the standard answer for that question. The correct answer you provide will
          serve as a 'gold standard' to help us evaluate and correct the model's knowledge gaps.
        </>
      )
    },
    evaluation_criteria: {
      des: 'Your submission will be automatically given a quality score from D to S based on the following criteria:',
      list: [
        {
          label: 'D',
          des: 'The submitted answer text severely mismatches the screenshot content, or the submission contains invalid information like gibberish, ads, etc.'
        },
        {
          label: 'C',
          des: 'The submitted question is subjective (e.g., seeking opinions or suggestions) rather than an objective question with a single standard answer.'
        },
        {
          label: 'B',
          des: "The model's answer is already mostly correct, and your provided 'correct answer' has no substantial difference from it (e.g., only fixing format, units, or wording)."
        },
        {
          label: 'A',
          des: "The 'correct answer' you provided is partially correct but is incomplete or fails to fully address the core of the question."
        },
        {
          label: 'S',
          des: "The model's answer contains a critical error, and the 'correct answer' you provided accurately and completely corrects it."
        }
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
      <h3 className="mb-2 mt-3 font-semibold text-white">📝 Evaluation Criteria</h3>
      <p className="mt-2 leading-[22px]">{list.evaluation_criteria.des}</p>
      <ul className="mt-2 leading-[22px]">
        {list.evaluation_criteria.list.map((item, index) => (
          <li key={`standards-${index}`}>
            {item.label}: {item.des}
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
    </div>
  )
}

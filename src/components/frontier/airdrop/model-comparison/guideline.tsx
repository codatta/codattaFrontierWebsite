export default function Guideline() {
  const list = {
    task_description: {
      des: (
        <>
          This project aims to discover inconsistencies that arise when top large models answer objective questions. You
          are required to submit an objective question that has a single standard answer, two different answers from two
          AI models (text and screenshot), and what you believe to be the correct standard answer. Each valid submission
          helps us pinpoint AI's knowledge gaps, contributing to its development and improvement.
        </>
      )
    },
    evaluation_criteria: {
      des: 'Your submission will be automatically reviewed and given a quality score from D to S based on the following criteria:',
      list: [
        {
          label: 'D',
          des: (
            <>
              The submitted answer text severely mismatches the screenshot content, or the submission contains invalid
              information like gibberish, ads, etc.
            </>
          )
        },
        {
          label: 'C',
          des: (
            <>
              The submitted question is subjective (e.g., seeking opinions or suggestions) rather than an objective
              question with a single standard answer.
            </>
          )
        },
        {
          label: 'B',
          des: (
            <>
              The core conclusions or key information of the two AI models' answers are consistent, lacking any
              substantial difference.
            </>
          )
        },
        {
          label: 'A',
          des: (
            <>
              The question and the difference in model answers are both valid, but the 'standard answer' you provided is
              inaccurate or incorrect.
            </>
          )
        },
        {
          label: 'S',
          des: (
            <>
              A perfect submission—the question is objective, the difference between the model answers is significant,
              and the standard answer you provided is accurate and correct.
            </>
          )
        }
      ]
    },
    note: 'Note: Focus on providing objective, evidence-based comparisons that help identify the strengths and weaknesses of each model.'
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
        Please strictly adhere to the following rules. <br />
        If any redline behavior is determined by the business, expert qualifications will be immediately revoked, and
        all unsettled data will not be paid for:
      </p>
      <ul className="mt-3 list-inside list-decimal text-[#8D8D93]">
        {list.map((item, index) => (
          <li key={`redline-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

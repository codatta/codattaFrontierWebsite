export default function Guideline() {
  const list = {
    task_description: {
      des: (
        <>
          This project aims to co-create a high-quality food nutrition database through the food photos you take and
          your precise annotations. You are required to submit a clear, aesthetically pleasing photo of a ready-to-eat
          dish. Please note: raw ingredients such as raw meat, raw fish, unprocessed vegetables, or unopened packaged
          products do not meet the requirements. Additionally, please provide an accurate food name, quantity, cooking
          method, and estimated calories for the food in the photo.
        </>
      )
    },
    evaluation_criteria: {
      des: 'Your submission will be comprehensively reviewed by the system, combining both image and text information, and given a quality score from D to S based on the following criteria:',
      list: [
        {
          label: 'D',
          des: 'The submitted image URL is invalid or inaccessible; there is no clearly discernible food in the picture; or the food is a non-ready-to-eat raw ingredient (e.g., raw meat, raw fish).'
        },
        {
          label: 'C',
          des: 'The annotated text information is gibberish, an ad, or completely unrelated to food.'
        },
        {
          label: 'B',
          des: "The annotated information contains obvious errors relative to the image content. For example: the food name doesn't match the picture, or the quantity, cooking method, or calorie values severely deviate from common sense."
        },
        {
          label: 'A',
          des: 'The annotated information is generally accurate, but the image quality is poor, such as a blurry main subject, poor composition, dim lighting, or a cluttered background.'
        },
        {
          label: 'S',
          des: 'A perfect submission-the image is clear and aesthetically pleasing, and all annotated information is accurate, reasonable, and complete.'
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

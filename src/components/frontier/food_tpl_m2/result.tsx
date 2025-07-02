import { useEffect, useState } from 'react'

import ApprovedIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg?react'

import { ModelInfo } from './types'

export default function Result({ modelInfo, templateId }: { modelInfo?: ModelInfo; templateId: string }) {
  const [week, setWeek] = useState('1')

  useEffect(() => {
    console.log(templateId, 'templateId')
    const reg = /FOOD_TPL_M2_W(\d)/
    const match = templateId.match(reg)
    if (match) {
      setWeek(match[1])
    }
  }, [templateId])

  return (
    <div className="px-6">
      <ApprovedIcon className="mx-auto mt-[50px]" />
      <h2 className="mt-8 text-center text-2xl font-bold">Submission approved!</h2>
      <div className="mt-6">
        {modelInfo?.modelA.name && (
          <div className="flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
            <span>Model A</span>
            <div className="flex items-center">
              {modelInfo?.modelA.name}
              {modelInfo?.modelA['fine-tuning'] && (
                <div className="ml-2 rounded-full bg-[#875DFF1F] px-[6px] text-xs leading-6">
                  {modelInfo?.modelA['fine-tuning']}
                </div>
              )}
            </div>
          </div>
        )}
        {modelInfo?.modelB.name && (
          <div className="mt-3 flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
            <span>Model B</span>
            <div className="flex items-center">
              {modelInfo?.modelB.name}
              {modelInfo?.modelB['fine-tuning'] && (
                <div className="ml-2 rounded-full bg-[#5DDD221F] px-[6px] text-xs leading-6">
                  {modelInfo?.modelB['fine-tuning']}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-base text-[#BBBBBE]">
        {week === '4'
          ? 'Thank you for participating in our two-month model iteration journey. Your data submission and annotation contributed to the entire process, from data collection and cleaning to model fine-tuning and deployment. We sincerely appreciate your support in helping us improve our AI models.'
          : 'Thank you for your data annotation. We will use your submission for fine-tuning to improve our model capabilities.'}
      </p>
    </div>
  )
}

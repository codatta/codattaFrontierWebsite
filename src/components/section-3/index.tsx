import { cn } from '@udecode/cn'

import DynamicSvg from '@/components/dynamic-svg'

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      <p className="font-medium text-xl tracking-wide md:text-2xl">
        Vertical AI Agents
      </p>
      <h3 className="font-extrabold text-[32px] leading-10 mt-4 md:font-bold md:text-[56px] md:leading-[68px] md:tracking-tight">
        The New Saas Build Vertical AI Agents
      </h3>
      <p className="text-base tracking-wide mt-4 md:text-[18px] md:leading-[28px]">
        Vertical AI Agents are specialized AI entities tailored for specific
        industries. For instance, in healthcare, they assist with medical
        diagnoses using patient data,
      </p>
      <div className="text-left mt-[48px] flex flex-col gap-6 md:mt-[100px] md:flex md:gap-10 md:justify-center md:flex-row">
        <Card
          iconName="rect-ai"
          title="Industry-Specific Intelligence"
          des="Create Al agents with deep vertical knowledge that understand specific industry contexts, workflows, and challenges."
        />
        <Card
          iconName="rect-ball"
          title="Domain Expert Integration"
          des="Seamlessly combine Al capabilities with human domain expertise to build solutions that truly understand your industry."
        />
        <Card
          iconName="rect-cross"
          title="Automated Workflows"
          des="Transform traditional SaaS functions into intelligent agents that automate complex industry-specific processes."
        />
      </div>
    </div>
  )
}

function Card({
  className,
  iconName,
  title,
  des,
}: {
  className?: string
  iconName: string
  title: string
  des: string
}) {
  return (
    <div
      className={cn(
        'border border-[#0000001F] border-solid rounded-3xl flex flex-col p-10 tracking-wide',
        className
      )}
    >
      <DynamicSvg iconName={iconName} className="w-[72px] h-[72px]" />
      <h3 className="mt-10 font-semibold text-xl">{title}</h3>
      <p className="mt-[14px] text-base leading-7 text-[#00000080]">{des}</p>
    </div>
  )
}

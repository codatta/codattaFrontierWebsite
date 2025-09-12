import { motion } from 'framer-motion'

import ApprovedIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg?react'
import PendingIcon from '@/assets/images/task-pending.svg?react'
import RejectIcon from '@/assets/images/task-reject.svg?react'

import { ResultType } from './types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Animate children with a 0.2s delay between them
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
}

export default function Result({
  type = 'ADOPT',
  maxValidateDays,
  validatedDays,
  showProgress,
  onSubmitAgain
}: {
  type: ResultType
  maxValidateDays?: number
  validatedDays?: number
  showProgress?: boolean
  onSubmitAgain?: () => void
}) {
  return type === 'ADOPT' ? (
    <ApprovedView
      maxValidateDays={maxValidateDays || 0}
      validatedDays={validatedDays || 0}
      showProgress={showProgress}
    />
  ) : type === 'REJECT' ? (
    <RejectView onSubmitAgain={onSubmitAgain} />
  ) : (
    <PendingView />
  )
}

function ApprovedView({
  maxValidateDays,
  validatedDays,
  showProgress
}: {
  maxValidateDays: number
  validatedDays: number
  showProgress?: boolean
}) {
  return (
    // 3. Apply the container variants to a motion.div
    <motion.div className="px-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* 4. Animate the icon with its specific variant */}
      <motion.div variants={iconVariants}>
        <ApprovedIcon className="mx-auto mt-[50px]" />
      </motion.div>

      {/* 5. Apply the general item variant to other elements */}
      <motion.h2 variants={itemVariants} className="mt-8 text-center text-2xl font-bold">
        Submission approved!
      </motion.h2>
      {showProgress ? (
        <>
          <div className="my-6 rounded-full border-white/60">
            <SubmissionProgress validatedDays={validatedDays} maxValidateDays={maxValidateDays || 0} />
          </div>
          <p className="text-center text-base font-bold text-[#22DD61]">Today's submission is completed.</p>
          <motion.p variants={itemVariants} className="mt-6 text-center text-base text-[#BBBBBE]">
            Thank you for annotating robotics data! Your contribution helps advance the robotics industry.
          </motion.p>
          <div className="mt-6 rounded-xl bg-[#252532] p-4 text-base font-bold">
            Earn more $XNY tokens by joining exclusive campaigns on our desktop site:{' '}
            <a target="_blank" href="https://app.codatta.io" rel="noreferrer" className="font-normal text-[#875DFF]">
              https://app.codatta.io
            </a>
          </div>
          <PleaseNote className="my-3" />
        </>
      ) : (
        <>
          <motion.p variants={itemVariants} className="mt-6 text-center text-base text-[#BBBBBE]">
            Thank you for annotating robotics data! Your contribution helps advance the robotics industry.
          </motion.p>
          <div className="mt-6 rounded-xl bg-[#252532] p-4 text-base font-bold">
            Earn more $XNY tokens by joining exclusive campaigns on our desktop site:{' '}
            <a target="_blank" href="https://app.codatta.io" rel="noreferrer" className="font-normal text-[#875DFF]">
              https://app.codatta.io
            </a>
          </div>
        </>
      )}
    </motion.div>
  )
}

function PendingView() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[40px]">
      <PendingIcon className="mb-8 size-[120px]" />
      <div className="mb-6 text-center text-2xl font-bold text-[#FFA800]">Under Review</div>

      <div className="mb-3 flex flex-col gap-2 text-[15.5px] leading-6 text-white/60">
        <p className="text-center">
          The review results will be available within
          <span className="font-bold text-[#FFA800]"> 15 minutes</span>. Please proceed with verification only after
          your submission has been approved.
        </p>
        <PleaseNote className="my-3" />
      </div>
    </div>
  )
}

function RejectView({ onSubmitAgain }: { onSubmitAgain?: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[40px]">
      <RejectIcon className="mb-8 size-[120px]" />
      <div className="mb-6 text-center text-2xl font-bold text-[#D92B2B]">Audit Failed</div>
      <p className="mb-8 text-center text-[15.5px] text-white/60">So close! Tweak it and resubmit—you’ve got this!</p>
      <button className="block h-[44px] w-full rounded-full bg-white text-black" onClick={onSubmitAgain}>
        Submit
      </button>
    </div>
  )
}

function PleaseNote(props: { className?: string }) {
  return (
    <div className="text-[#BBBBBE]">
      <div className={`flex w-full items-center gap-3 ${props.className}`}>
        <hr className="flex-1 border-[#BBBBBE]" />
        <span className="text-center">Please note</span>
        <hr className="flex-1 border-[#BBBBBE]" />
      </div>
      <ul className="list-disc pl-4">
        <li>Rewards will be distributed according to Binance campaign rules upon successful verification. </li>
        <li>
          All submission days are counted based on <span className="font-bold text-[#FFA800]">UTC time</span>.
        </li>
      </ul>
    </div>
  )
}

function SubmissionProgress(props: { maxValidateDays: number; validatedDays: number }) {
  const { maxValidateDays, validatedDays } = props
  return (
    <div className="flex w-full flex-wrap items-center justify-center rounded-full border border-white/10 py-4 text-center">
      <div className="mr-3 text-2xl font-bold">
        <span className="text-[#5DDD22]">{Math.min(validatedDays, maxValidateDays)}</span>
        <span>/{maxValidateDays}</span>
      </div>
      <span>Days Submitted/Required Days</span>
    </div>
  )
}

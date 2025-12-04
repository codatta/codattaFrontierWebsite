import React, { useState } from 'react'
import { X } from 'lucide-react'

interface InformedConsentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const InformedConsentForm: React.FC<InformedConsentFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [ageConsent, setAgeConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [residenceConsent, setResidenceConsent] = useState(false)

  const handleSubmit = () => {
    if (ageConsent && termsConsent && residenceConsent) {
      onSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-[#1C1C26B8]">
      <div className="shadow-xl relative w-[800px] rounded-2xl bg-[#252532] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFFFFF1F] px-6 pb-3 pt-6">
          <h2 className="text-xl font-semibold leading-[30px]">Informed Consent Form</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[366px] overflow-y-auto p-6">
          <div className="mb-2">
            <strong className="mb-6">Study Title: Data Pricing Study (STUDY2024_00000503)</strong>
          </div>

          <div className="mb-2">
            <strong className="mb-2 block">Principal Investigator(s): </strong>
            <p className="text-gray-700">
              Cathy Jiao, Language Technologies Institute, PhD Student, cljiao@andrew.cmu.edu
              <br />
              Luyang Zhang, Heinz College, PhD Student, luyangz@andrew.cmu.edu <br />
              Luoqi Chen, Language Technologies Institute, Masters Student, luoqic@andrew.cmu.edu
            </p>
          </div>

          <div className="mb-2">
            <strong className="mb-2 block">Faculty Advisor(s):</strong>
            <p className="text-gray-700">
              Chenyan Xiong, Language Technologies Institute, Associate Professor, cx@andrew.cmu.edu
              <br /> Beibei L, Heinz College, Professor, beibeili@andrew.cmu.edu
              <br /> Sherry Wu, Assistant Professor, Language Technologies Institute and Human Computer Interaction
              Institute, sherryw@cs.cmu.edu
            </p>
          </div>

          {/* Purpose */}
          <div className="mb-2">
            <p className="text-gray-700">
              <strong className="text-white">Sponsor(s):</strong> None. This research is funded by Prof. Xiong's
              discretionary funds.
            </p>
          </div>

          <hr className="my-6 border-[#FFFFFF1F]" />

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Purpose of this Study</h3>
            <p className="text-gray-700">
              The purpose of the study is to investigate pricing methods for data annotation tasks.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Summary</h3>
            <p className="text-gray-700">
              We are conducting a study to investigate pricing strategies for data annotation tasks. Participants will
              be asked to complete video evaluation tasks on Codatta.io, a data annotation platform. Participants will
              receive Codatta reward points for each annotation they provide, which translates to a dollar amount (in
              USD) that the participants will be paid.
            </p>
            <p className="text-gray-700">
              Participants will be asked to compare and evaluate video clips based on a text query (e.g., “How do I cut
              a mango?”). In order to complete the task, the participants should be familiar with basic website usage
              (e.g., playing a video, entering text).
            </p>
          </div>

          {/* Procedures */}
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Procedures</h3>
            <p className="text-gray-700">
              After providing consent, participants will be redirected to Co-datta.io to complete the task.
            </p>
            <p className="text-gray-700">
              To perform the video evaluation task, participants will be shown a text query (e.g., “How do you slice a
              mango?”) and two videos that attempt to address the query. Participants will be asked which video is
              better at addressing the query, and briefly include a written reasoning for their choice. Then, based on
              the participant’s previous response, the participant will be asked a series of questions with respect to
              the video they preferred.
            </p>
            <p className="text-gray-700">
              After each annotation, participants will be informed of the reward points they earned for their
              contribution. We do not require the participant to perform a specific number of annotations. Instead, we
              ask participants complete all assigned annotations to receive rewards.
            </p>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Participant Requirements</h3>
            <p className="text-gray-700">
              Participation in this study is limited to individuals age 18 and older. Participants should be familiar
              with basic website usage (e.g., navigating a website, uploading photos) and interacting with chatbots.
            </p>
          </div>
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Risks</h3>
            <p className="text-gray-700">
              The risks and discomfort associated with participation in this study are no greater than those Ordinarily
              encountered in daily life or during other online activities. To protect the participants’ privacy, we
              advise the participants to upload pictures ONLY containing food (i.e., no faces or identifiable
              information in the background).
            </p>
            <p className="text-gray-700">
              There is a small risk of a breach of confidentiality, as we collect participants’ Codatta ids, Prolific
              ids, or MTurk ids. However, we will minimize this risk by translating these personal identifiers to a
              code, and by ensuring that the papers that have these personal identifiers are stored securely, and will
              not be shared with anyone outside of Carnegie Mellon University.
            </p>
          </div>
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Benefits</h3>
            <p className="text-gray-700">
              There may be no personal benefit from your participation in the study but the knowledge received may be of
              value to humanity. Participants may contribute towards building better deep learning models for food
              science and investigating better compensation for data annotators.
            </p>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Compensation & Costs</h3>
            <p className="text-gray-700">
              Participants will be awarded with Codatta reward points, which reflects a dollar amount that the
              participants will be paid. We will adjust the base amount the participant will be paid to meet at least
              the U.S. federal minimum wage (and be up to $15 USD per hour), prorated for the length per task. There
              will be no cost to you if you participate in this study.
            </p>
          </div>
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Confidentiality</h3>
            <p className="text-gray-700">
              By participating in the study, you understand and agree that Carnegie Mellon may be required to disclose
              your consent form, data and other personally identifiable information as required by law, regulation,
              subpoena or court order. Otherwise, your confidentiality will be maintained in the following manner:
            </p>
            <p className="text-gray-700">
              Your data and consent form will be kept separate. Your research data will be stored in a secure location
              on Carnegie Mellon property. By participating, you understand and agree that the data and information
              gathered during this study may be used by Carnegie Mellon and published and/or disclosed by Carnegie
              Mellon to others outside of Carnegie Mellon. However, your name, address, contact information and other
              direct personal identifiers will not be mentioned in any such publication or dissemination of the research
              data and/or results by Carnegie Mellon. Note that per regulation all research data must be kept for a
              minimum of 3 years.
            </p>
            <p className="text-gray-700">
              The researchers will take the following steps to protect participants’ identities during this study: (1)
              Each participant will be assigned a number; (2) The researchers will record any data collected during the
              study by number, not by name; (3) Any original recordings or data files will be stored in a secured
              location accessed only by authorized researchers.
            </p>
            <p className="text-gray-700">
              Mturk, Prolific, and Codatta are not owned by CMU. The company will have access to the research data that
              you produce and any identifiable information that you share with them while using their product. Please
              note that Carnegie Mellon does not control the Terms and Conditions of the companies or how they will use
              any information that they collect.
            </p>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Future Use of Information</h3>
            <p className="text-gray-700">
              In the future, once we have removed all identifiable information from your data (information), we may use
              the data for our future research studies, or we may distribute the data to other investigators for their
              research studies. We would do this without getting additional informed consent from you. Sharing of data
              with other researchers will only be done in such a manner that you will not be identified.
            </p>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Rights</h3>
            <p className="text-gray-700">
              Your participation is voluntary. You are free to stop your participation at any point. Refusal to
              participate or withdrawal of your consent or discontinued participation in the study will not result in
              any penalty or loss of benefits or rights to which you might otherwise be entitled. The Principal
              Investigator may at his/her discretion remove you from the study for any of a number of reasons. In such
              an event, you will not suffer any penalty or loss of benefits or rights which you might otherwise be
              entitled.
            </p>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">
              Right to Ask Questions & Contact Information
            </h3>
            <p className="text-gray-700">
              If you have any questions about this study, you should feel free to ask them now. If you have questions
              later, desire additional information, or wish to withdraw your participation please contact the Principal
              Investigator by mail, phone or e-mail in accordance with the contact information listed on the first page
              of this consent.
            </p>
            <p className="text-gray-700">
              If you have questions pertaining to your rights as a research participant; or to report concerns to this
              study, you should contact the Office of Research Integrity and Compliance at Carnegie Mellon University.
              Email: irb-review@andrew.cmu.edu . Phone: 412-268-4721.
            </p>
          </div>
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Voluntary Consent</h3>
            <p className="text-gray-700">
              Your participation in this research is voluntary. You may discontinue participation at any time during the
              research activity. You may print a copy of this consent form for your records.
            </p>
            <p className="text-gray-700">
              By continuing to the web interface of this study, you agree that the above information has been explained
              to you and all your current questions have been answered. In addition, by continuing on the web interface,
              you confirm that you are age 18 or older, and you agree to participate in this research study. You are
              encouraged to ask questions about any aspect of this research study during the course of the study and in
              the future.
            </p>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="flex items-end justify-between border-t border-[#FFFFFF1F] p-6">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={ageConsent}
                onChange={(e) => setAgeConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">Age ≥ 18</span>
            </label>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">I have read and agree to the terms of this consent form.</span>
            </label>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={residenceConsent}
                onChange={(e) => setResidenceConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">I certify I am currently residing in the U.S.</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button onClick={onClose} className="h-[42px] w-[120px] text-center text-[#FFFFFF]">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!ageConsent || !termsConsent || !residenceConsent}
              className={`h-[42px] w-[120px] rounded-[36px] bg-primary text-center text-[#FFFFFF] ${
                ageConsent && termsConsent && residenceConsent
                  ? 'opacity-100 hover:bg-[#8A5AEE]'
                  : 'cursor-not-allowed opacity-50'
              } transition-colors`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformedConsentForm

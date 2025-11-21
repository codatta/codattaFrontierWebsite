import { Info } from 'lucide-react'

import UploadImg from '@/components/frontier/airdrop/UploadImg'
import { UploadedImage } from '@/components/frontier/verification/use-verification'

interface CredentialUploadSectionProps {
  academicCredentials: UploadedImage[]
  cvFiles: UploadedImage[]
  errors: Record<string, string>
  setAcademicCredentials: (value: UploadedImage[]) => void
  setCvFiles: (value: UploadedImage[]) => void
}

export default function CredentialUploadSection({
  academicCredentials,
  cvFiles,
  errors,
  setAcademicCredentials,
  setCvFiles
}: CredentialUploadSectionProps) {
  return (
    <div className="!mb-0 !mt-6 space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-white">Academic Credential</h2>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-white" />
            <span className="text-sm text-white">
              Any document type acceptable (student ID, degree certificate, CHSI verification, etc.). Name and photo may
              be redacted.
            </span>
          </div>
        </div>
        <UploadImg
          value={academicCredentials}
          onChange={setAcademicCredentials}
          maxCount={1}
          description="Click to upload image or drag and drop"
        />
        {errors.academicCredentials && <p className="mt-1 text-sm text-red-500">{errors.academicCredentials}</p>}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-white">CV Upload</h2>
        <UploadImg
          value={cvFiles}
          onChange={(files) => setCvFiles(files)}
          maxCount={1}
          supportPdf
          description={
            <span>
              Click to upload image or drag and drop
              <br />
              Supports PDF，Image upload
            </span>
          }
        />
        {errors.cvFiles && <p className="mt-1 text-sm text-red-500">{errors.cvFiles}</p>}
      </div>
    </div>
  )
}

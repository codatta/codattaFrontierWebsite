import { useEffect, useState } from 'react'
import NoTextLogoWhite from '@/assets/common/logo-white-notext.svg'
import Network from '@/components/common/network-icon'

import Contributors from '@/components/data-profile/contributors'
import DataEvaluation from '@/components/data-profile/data-evaluation'
import Applications from '@/components/data-profile/applications'
import Statistics from '@/components/data-profile/statistics'
import Evidence from '@/components/data-profile/evidence'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'
import CustomEmpty from '@/components/common/empty'
import dataProfile, { DataDetail, ProfileEvidence } from '@/api-v1/dataprofile'

export default function Component() {
  const { network, address } = useParams()

  const [detail, setDetail] = useState<DataDetail>()
  const [loading, setLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [evidence, setEvidence] = useState<ProfileEvidence[]>([])
  const [permission, setPermission] = useState<boolean>(false)

  useEffect(() => {
    if (network && address) {
      setLoading(true)

      const profileRequest = dataProfile
        .getDataProfile({ network, address, count: 50 })
        .then((res) => {
          if (res.data) {
            setDetail(res.data)
            setNoData(false)
          }
        })
        .catch((err) => {
          console.log(err)
          setNoData(true)
        })

      const evidenceRequest = dataProfile
        .getDataProfileEvidence({ network, address, count: 50 })
        .then((res) => {
          if (res.data) {
            setPermission(true)
            setEvidence(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
          setPermission(false)
        })

      Promise.all([profileRequest, evidenceRequest]).finally(() => {
        setLoading(false)
      })
    }
  }, [])

  return (
    <div className="h-screen w-screen min-w-[1120px]">
      <div className="flex items-center justify-between border-b border-b-[#FFFFFF]/15 px-[200px] py-4">
        <div className="w-[120px]">
          <img className="w-[60px]" src={NoTextLogoWhite} alt="" />
        </div>
        <div className="size-4 w-auto font-bold">DATA PROFILE</div>
        <a
          className="bottom-px flex h-[42px] w-[120px] cursor-pointer items-center justify-center rounded-[40px] border-white text-sm hover:border-primary hover:text-primary"
          href="/app"
          target="_blank"
        >
          View More
        </a>
      </div>
      <Spin spinning={loading}>
        {noData && <CustomEmpty />}
        {!noData && (
          <>
            <div className="px-[200px] pb-10">
              {/*  */}
              <div className="mt-10">
                <h2 className="mb-4 font-mona text-xl font-bold leading-relaxed">Address</h2>
                <div className="rounded-2xl bg-[#252532] p-6">
                  <div className="flex">
                    <Network size={24} type={network || ''} />
                    <span className="ml-4 size-[18px] font-bold">{address}</span>
                  </div>
                  <div className="mt-6 flex gap-16">
                    <div>
                      <div className="text-sm text-gray-800">Category</div>
                      <div className="mt-3 flex gap-3">
                        {detail?.profile?.category?.map((item) => (
                          <div className="rounded-[20px] border border-gray-800 px-4 py-[6px] text-sm text-gray-800">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-800">Entity</div>
                      {detail?.profile?.entity && (
                        <div className="mt-3 rounded-[20px] border border-gray-800 px-4 py-[6px] text-sm text-gray-800">
                          {detail?.profile?.entity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Contributors submitters={detail?.submission_infos || []} validaters={detail?.validation_infos || []} />
              <Evidence evidence={evidence} address={address || ''} permission={permission} />
              <DataEvaluation data={detail?.profile?.meta_info_history || []} />
              <div className="flex gap-x-6">
                <div className="min-w-[400px] flex-auto">
                  <Applications useOrg={detail?.profile?.use_org || []} />
                </div>
                <div className="w-[394px] flex-none">
                  <Statistics count={detail?.profile?.visit_count || 0} />
                </div>
              </div>
            </div>
            <div className="pb-20 pt-10 text-center text-xs text-gray-400">
              © 2024 Blockchain Metadata Labs Inc. All rights reserved.
            </div>
          </>
        )}
      </Spin>
    </div>
  )
}

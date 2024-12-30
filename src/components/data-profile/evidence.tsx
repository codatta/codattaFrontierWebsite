import { EyeInvisibleFilled, QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import CustomEmpty from '@/components/common/empty'
import { ProfileEvidence } from '@/api-v1/dataprofile'

const Evidence = ({ evidence, permission }: { evidence: ProfileEvidence[]; address: string; permission: boolean }) => {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center">
        <h2 className="font-mona text-xl font-bold leading-relaxed">Evidence</h2>
        <Tooltip
          title="The evidence is a document that shows how we obtained the category and entity information for this address."
          className="ml-2 cursor-pointer"
        >
          <QuestionCircleOutlined className="text-xl" />
        </Tooltip>
      </div>
      {permission ? (
        <>
          {evidence?.length > 0 ? (
            <>
              {evidence?.map((item, index) => {
                return (
                  <div key={index} className="mb-6 rounded-2xl border border-[#FFFFFF]/10 p-6">
                    <div className="mb-5">
                      {/* <span className="font-700 mr-4 text-base"> */}
                      {/* {truncateStr(address, { len: 14, ellipsis: '***' })} */}
                      {/* {item.address?.[0]} */}
                      {/* </span> */}
                      <span className="text-sm text-gray-700">{item.date}</span>
                    </div>
                    <div className="h-[640px] rounded-xl bg-[#252532] p-2">
                      <iframe
                        title="Embedded Page"
                        width="100%"
                        height="100%"
                        src={`${item.url}#toolbar=0`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl bg-[#252532] p-6">
              <CustomEmpty />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl bg-[#252532] p-6">
            <EyeInvisibleFilled className="text-3xl" />
            <div className="mt-2 w-[268px] text-center text-sm text-gray-700">
              You currently do not have access to view the evidence.
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Evidence

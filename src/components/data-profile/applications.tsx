import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { UseOrg } from '@/api-v1/dataprofile'

const Applications = ({ useOrg }: { useOrg: UseOrg[] }) => {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center">
        <h2 className="font-mona text-xl font-bold leading-relaxed">Applications</h2>
        <Tooltip
          title="Display the products or platform that have adopted this address label"
          className="ml-2 cursor-pointer"
        >
          <QuestionCircleOutlined className="text-xl" />
        </Tooltip>
      </div>

      <div className="flex min-h-[120px] flex-wrap gap-x-12 gap-y-3 rounded-2xl bg-[#252532] p-10">
        {useOrg?.map((item) => (
          <div key={item.link}>
            {item.type === 'logo' && (
              // <a href={item.link} target="_blank" className="block">
              <img className="h-10 w-auto cursor-pointer" src={item.name} alt={item.name} />
              // </a>
            )}
            {item.type === 'name' && (
              <a href={item.link} target="_blank" className="block cursor-pointer text-3xl font-bold">
                {item.name}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Applications

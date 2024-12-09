import { Skeleton } from 'antd'

export default function PageSkeleton() {
  return (
    <>
      <Skeleton.Node active />
      <Skeleton active className="" />
    </>
  )
}

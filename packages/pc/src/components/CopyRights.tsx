import styled from 'styled-components'

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
`

const CopyRights = () => {
  return (
    <div className="mt-48px text-base text-#fff text-opacity-45">
      <Divider />
      <div>© 2024 Blockchain Metadata Labs Inc. All rights reserved.</div>
    </div>
  )
}

export default CopyRights

import styled from 'styled-components'

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
`

const CopyRights = () => {
  return (
    <>
      <Divider />
      <div className="text-base">
        © 2024 b18a Labs Inc. All rights reserved.
      </div>
    </>
  )
}

export default CopyRights

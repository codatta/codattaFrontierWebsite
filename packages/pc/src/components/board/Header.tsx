import styled from 'styled-components'

import Header from '@/components/Header'

const Title = styled.div`
  background: linear-gradient(90deg, #fff 0%, #5f6883 100%);
  background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
`

const BoardHeader = () => {
  return (
    <>
      <Header />
      <Title className="text-2xl font-bold tracking-tight mt-24px">
        Let's annotate crypto addresses from here
      </Title>
      <p className="text-xl tracking-tighter text-#fff text-opacity-25">
        The world's leading Al-powered collaboration protocol for blockchain
        metadata.
      </p>
    </>
  )
}

export default BoardHeader

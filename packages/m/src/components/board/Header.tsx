import styled from 'styled-components'

const Title = styled.div`
  background: linear-gradient(90deg, #fff 0%, #5f6883 100%);
  background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
`

const Header = () => {
  return (
    <>
      <Title className="text-xl font-bold tracking-tight mt-20px">
        Let's annotate crypto addresses from here
      </Title>
      <p className="text-sm tracking-tighter text-#fff text-opacity-50">
        The world's leading Al-powered collaboration protocol for blockchain
        metadata
      </p>
    </>
  )
}

export default Header

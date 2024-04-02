import Article1 from './components/article-1/Index'
import Article2 from './components/article-2/Index'
import Article3 from './components/article-3/Index'
import Article4 from './components/article-4/Index'
import Article5 from './components/article-5/Index'

import Footer from './components/Footer'
import { DynamicContextProps, DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import './App.scss'


function App() {

  const settings: DynamicContextProps['settings'] = {
    environmentId: 'a55eb2b4-84ca-41ff-a369-fc52646ed585',
    walletConnectors: [EthereumWalletConnectors],
  }

  return (
    <div className="ml-64px pb-46px min-h-screen m-auto">
      <DynamicContextProvider settings={settings}>
        <Article1 />
        <Article2 />
        <Article3 />
        <Article4 />
        <Article5 />
        <Footer />
      </DynamicContextProvider >
    </div>
  )
}

export default App

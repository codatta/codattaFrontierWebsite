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
    environmentId: 'ddf871be-8ba9-48df-826a-31d6e573f189',
    walletConnectors: [EthereumWalletConnectors],
  }

  return (
    <div className="min-h-screen m-auto">
      <DynamicContextProvider settings={settings}>
        <Article1 />
        <Article2 />
        <Article3 />
        <Article4 />
        <Article5 />
        <Footer />
      </DynamicContextProvider>
    </div>
  )
}

export default App

import Article1 from './components/article-1/Index'
import Article2 from './components/article-2/Index'
import Article3 from './components/article-3/Index'
import Article4 from './components/article-4/Index'
import Article5 from './components/article-5/Index'

import Footer from './components/Footer'

import './App.scss'

function App() {
  return (
    <div className="min-h-screen m-auto">
      <Article1 />
      <Article2 />
      <Article3 />
      {/* <Article4 />
      <Article5 /> */}
      <Footer />
    </div>
  )
}

export default App

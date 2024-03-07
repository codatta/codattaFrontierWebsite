// import Home from './pages/Home'
// import Header from './components/Header'
// import Part1 from './components/Part-1'
// import Part2 from './components/Part-2'
// import Part3 from './components/Part-3'
// import Part4 from './components/Part-4'
// import Part5 from './components/Part-5'

// import Tracing from './components/Tracing'

import Article1 from './components/article-1/Index'
import Article2 from './components/article-2/Index'
import Article3 from './components/article-3/Index'
// import Article4 from './components/article-4/Index'

import Footer from './components/Footer'

import './App.scss'

function App() {
  return (
    <div className="ml-64px pb-46px min-h-screen m-auto">
      <Article1 />
      <Article2 />
      <Article3 />
      {/* <Article4 /> */}
      {/* <article> */}
      {/* <Tracing> */}
      {/* <Part1 />
        <Part2 />
        <Part3 />
        <Part4 />
        <Part5 /> */}
      {/* </Tracing> */}
      {/* </article> */}
      <Footer />
    </div>
  )
}

export default App

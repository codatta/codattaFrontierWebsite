import { useState } from 'react'
import reactLogo from '@/assets/images/react.svg'
import viteLogo from '@/assets/images/vite.svg'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to b18a</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      {/*  */}
      <div className="card">
        <button
          onClick={() => window.alert(`Hello World! Current count is ${count}`)}
        >
          Show Alert
        </button>
      </div>
    </>
  )
}

export default App

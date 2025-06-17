import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// import placeHolder from "https://upload.wikimedia.org/wikipedia/commons/d/db/MenuResp.png"

function App() {
  const [count, setCount] = useState(0)
  
  return <div className="fullscreen-bg"> 
    <>
      <header>
        <div id = "title">GUARD COMICS</div>
      </header>

      <div id="comicImgs"></div>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  </div>;
}

export default App

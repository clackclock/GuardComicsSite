import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import placeHolder from "https://upload.wikimedia.org/wikipedia/commons/d/db/MenuResp.png";
import ph from "../src/assets/orionthemes-placeholder-image-2";

function App() {
  const [count, setCount] = useState(0)
  
  const ranComic= {

  }

  return <div className="fullscreen-bg"> 
    <>
      <header>
        <img className = "logo" src = "./src/assets/orionthemes-placeholder-image-2.png" alt = "gc_logo" height = "150px"/>
        <div id = "title">GUARD COMICS</div>

        <div className = "dropdown">
          <img className ="menu" src = {placeHolder} alt="empty" width = "60px" height = "60px" />
          <div className = "dropdown-content">
            <button className="button-57" role="button"><span class="text">Artisans' Quarters</span><span>Comic List</span></button>
            <button className="button-57" role="button"><span class="text">Town Bulletin</span><span>Latest Updates</span></button>
            {/* <button className="button-57" role="button"><span class="text">Spring Gala</span><span>New Comics</span></button> */}
            {/* <button className="button-57" role="button"><span class="text">Genres</span><span>IDK Genres</span></button> */}
            <button className="button-57" role="button"><span class="text">King's Court</span><span>Info & More</span></button>
          </div>
        </div>
      </header>

      <div itemID = "Artisan">
        <div className='booklet'>
          <img src={ph} alt="booklet cover"/>
          <a className='title'></a>
        </div>
      </div>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  </div>;
}

export default App

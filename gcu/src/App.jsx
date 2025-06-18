import { useState } from 'react'
import './App.css'

// import placeHolder from "https://upload.wikimedia.org/wikipedia/commons/d/db/MenuResp.png"

function App() {
  const [count, setCount] = useState(0)
  const ranComic= {
  }

  const [items, setItems] = useState([]); //'Item 1', 'Item 2'
  const addBook = () => {
    setItems([...items, `Item ${items.length + 1}`]); //replace this with book title
  };

  const makeBooklet = () =>{
    // return <div className='booklet'>Title</div>
    // return React.createElement('div',{className:'booklet'},"title");
  };
  // const book = <div className='booklet'>Title</div>;
  

  return <div className="fullscreen-bg"> 
    <>
      <header>
        <img className = "logo" src = "./src/assets/orionthemes-placeholder-image-2.png" alt = "gc_logo" height = "150px"/>
        <div id = "title">GUARD COMICS</div>

        <div className = "dropdown">
          <img className ="menu" src ="https://upload.wikimedia.org/wikipedia/commons/d/db/MenuResp.png"  alt="empty" width = "60px" height = "60px" />
          <div className = "dropdown-content">
            <button className="button-57" role="button"><span className="text">Artisans' Quarters</span><span>Comic List</span></button>
            <button className="button-57" role="button"><span className="text">Town Bulletin</span><span>Latest Updates</span></button>
            {/* <button className="button-57" role="button"><span class="text">Spring Gala</span><span>New Comics</span></button> */}
            {/* <button className="button-57" role="button"><span class="text">Genres</span><span>IDK Genres</span></button> */}
            <button className="button-57" role="button"><span className="text">King's Court</span><span>Info & More</span></button>
          </div>
        </div>
      </header>

      <div id = "Artisan">
        <h3>NEW RELEASES</h3>
        < div id='alley'>
          <div className='booklet'>
            <img className = "coverIMG" src="./src/assets/Chess_knight.png" alt="booklet cover" height="90px"/>
            <a className='title'>TITLE</a>
          </div>
          {items.map((item, index) => (
            <div key={index} className="booklet">
              <img className = "coverIMG" src="./src/assets/Chess_knight.png" alt="booklet cover" height="90px"/>
              <a className='title'>{item}</a>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => addBook()}>+New Comic</button>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  </div>;
}

export default App

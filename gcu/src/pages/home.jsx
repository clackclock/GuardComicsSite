import { useState } from 'react'
import '../App.css'
import knight from '../assets/Chess_knight.png'

function Home(){
  const [count, setCount] = useState(0)

  return <div className="fullscreen-bg"> 
    <>
      <div id="News">
        <h3>DAILY REPORT</h3>
        <div className='reportText'>REPORTS OF DEADLY BEARS</div>
      </div>
      <div id = "Artisan">
        <h3>NEW RELEASES</h3>
        < div id='alley'>
          <div className='booklet'>
            <img className = "coverIMG" src={knight} alt="booklet cover" height="90px"/>
            <a className='title'>TITLE</a>
          </div>
        </div>
      </div>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  </div>;
};

export default Home;
import { useState } from 'react'
import '../App.css'
import knight from '../assets/Chess_knight.png'

const Gallery = () => { 
    const [items, setItems] = useState([]); //'Item 1', 'Item 2'
    const addBook = () => {
        setItems([...items, `Item ${items.length + 1}`]); //replace this with book title
    };

  return <div className="fullscreen-bg"> 
    <>
      <main>
            {items.map((item, index) => (
                <div key={index} className="booklet">
                  <img className = "coverIMG" src={knight} alt="booklet cover" height="90px"/>
                  <a className='title'>{item}</a>
                </div>
            ))}
      </main>
      <button onClick={() => addBook()}>+New Comic</button>
    </>
  </div>;
  
};

export default Gallery;
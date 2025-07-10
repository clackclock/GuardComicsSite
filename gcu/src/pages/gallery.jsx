import { useState, useEffect } from 'react'
import '../App.css'
import knight from '../assets/Chess_knight.png'

const Gallery = () => { 
  //this will parse through ./Archive and grab the folders and make them booklets
  const [items, setItems] = useState([]); //'Item 1', 'Item 2'
  const addBook = () => {
    setItems([...items, `Issue ${items.length + 1}`]); //replace this with book title
  };
  const [showContent, setShowContent] = useState(true);
  const newBookMenu = () => {
    setShowContent(!showContent);
  };

  const [folderCount, setFolderCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/folder-count'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFolderCount(data.count);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFolderCount();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (folderCount === null) {
    return <div>Loading folder count...</div>;
  }

  
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

      <h1>Number of folders: {folderCount}</h1>
      <button>Click</button>
    </>
  </div>;
  
};

export default Gallery;
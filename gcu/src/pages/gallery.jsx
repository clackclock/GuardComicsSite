import { useState } from 'react'
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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileChange = (event) => {
    // `event.target.files` is a FileList object, NOT an array.
    // Convert it to an array for easier manipulation.
    const filesArray = Array.from(event.target.files);
    setSelectedFiles(filesArray);
  };
  const handleFolderChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(Array.from(files)); // Convert FileList to an array
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles.length > 0) {
      // send the files to a server using FormData
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('Archive', file); // 'files' is the field name your server expects
      });

      //sending with fetch:
      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => console.log('Upload success:', data))
      .catch(error => console.error('Upload error:', error));

      console.log('Files to upload:', selectedFiles.map(file => file.name));
      addBook();
    } else {
      console.log('No files selected.');
    }
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
      <button onClick={() => newBookMenu()}>+New Comic</button>
      {showContent && (
        <div className="newComic">
          <form onSubmit={handleSubmit}>
            TITLE:
            <input type="text"></input>
            <input type="file" multiple webkitdirectory="true" directory="true" onChange={handleFolderChange} />
            <button type="submit" onClick={addBook}>Upload Folder</button>
            {selectedFiles.length > 0 && (
              <div>
                <h4>Selected Files:</h4>
                <ul>
                  {selectedFiles.map((file, index) => (
                    // <li key={index}>{file.name}</li>
                    <li key={index}>{file.webkitRelativePath || file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="updateComic"></div>
    </>
  </div>;
  
};

export default Gallery;
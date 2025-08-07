import { useState, useEffect } from 'react';
import '../App.css'
// import knight from '../assets/Chess_knight.png'

function Home(){
  const [count, setCount] = useState(0);
  const [newestFile, setNewestFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewestFile = async () => {
      try {
        const API_BASE_URL = 'http://localhost:5000/api';
        
        // Fetch the newest file from the backend's new endpoint
        const response = await fetch(`${API_BASE_URL}/newest-file`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewestFile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNewestFile();
  }, []);

  const renderFile = () => {
    if (!newestFile || !newestFile.fileName) {
      return <div>No files found in the archive.</div>;
    }

    const fileExtension = newestFile.fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
      return (
        <div className="newest-file-container">
          <h3>Latest Update: {newestFile.fileName}</h3>
          <embed src={newestFile.fileUrl} type="application/pdf" width="200px" height="300px" />
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <div className="newest-file-container">
          <h3>Latest Update: {newestFile.fileName}</h3>
          <img src={newestFile.fileUrl} alt={newestFile.fileName} style={{ maxWidth: '200px' }} />
        </div>
      );
    } else {
      return (
        <div className="newest-file-container">
          <h3>Newest Release: {newestFile.fileName}</h3>
          <p>Unsupported file type: .{fileExtension}</p>
        </div>
      );
    }
  };

  if (error) {
    return <div className="fullscreen-bg"><div><h1>Error: {error}</h1></div><button onClick={() => setCount((count) => count + 1)}>count is {count}</button></div>;
  }
  if (!newestFile) {
    return <div>Loading newest file...</div>;
  }

  return <div className="fullscreen-bg"> 
    <>
      <div id="News">
        <h3>DAILY REPORT</h3>
        <div className='reportText'>REPORTS OF DEADLY BEARS</div>
      </div>
      <div id = "Artisan">
        {/* <h3>NEW RELEASE</h3> */}
        < div id='alley'>
          {renderFile()}
        </div>
      </div>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  </div>;
};

export default Home;
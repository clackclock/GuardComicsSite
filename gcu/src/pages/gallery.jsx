import { useState, useEffect } from 'react';
import '../App.css'; // This import was causing a "Could not resolve" error.

const Gallery = () => {
  // Use a single state to store the list of files and handle loading/errors
  const [files, setFiles] = useState(null); // Initialize with null to distinguish from an empty array
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Use a consistent base URL for all API calls
        // Hardcoded the URL to fix the "import.meta" warning
        const API_BASE_URL = 'http://localhost:5000/api';
        
        // Fetch the list of files from the backend
        const response = await fetch(`${API_BASE_URL}/files`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFiles(data.files);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, []); // The empty dependency array ensures this runs only once

  const renderFile = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    // Hardcoded the URL to fix the "import.meta" warning
    const API_BASE_URL = 'http://localhost:5000/api';
    const fileUrl = `${API_BASE_URL.replace('/api', '')}/_archive/${fileName}`;

    if (fileExtension === 'pdf') {
      return (
        <div key={fileName} className="file-container">
          <h3>{fileName}</h3>
          <embed src={fileUrl} type="application/pdf" width="400px" height="400px" />
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <div key={fileName} className="file-container">
          <h3>{fileName}</h3>
          <img src={fileUrl} alt={fileName} style={{ maxWidth: '600px' }} />
        </div>
      );
    } else {
      return (
        <div key={fileName} className="file-container">
          <h3>{fileName}</h3>
          <p>Unsupported file type: .{fileExtension}</p>
        </div>
      );
    }
  };

  // --- Conditional Rendering for Loading, Error, and Content ---
  if (error) {
    return <div className="fullscreen-bg"><div><h1>Error: {error}</h1></div><button onClick={() => setCount((count) => count + 1)}>count is {count}</button></div>;
  }
  if (files === null) {
    return <div>Loading files...</div>;
  }
  
  // Now we know 'files' is an array, even if it's empty
  const fileCount = files.length;
  
  return (
    <div className="fullscreen-bg"> 
      <main className="gallery-main">
        {fileCount > 0 ? (
          files.map(renderFile)
        ) : (
          <div>No files found in the archive.</div>
        )}
      </main>
      <h1>Number of files: {fileCount}</h1>
      <button>YOP</button>
    </div>
  );
};

export default Gallery;

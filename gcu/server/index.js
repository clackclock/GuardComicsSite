const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can choose any port you like

// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());

// Define the path to your _archive directory
// IMPORTANT: Adjust this path based on your actual project structure.
// path.resolve(__dirname, '..', '_archive') assumes _archive is in the parent directory of the 'server' folder.
const archiveDirPath = path.resolve(__dirname, '..', '_archive');

// API endpoint to get folder count
app.get('/api/folder-count', (req, res) => {
    fs.readdir(archiveDirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Unable to read directory' });
        }

        const folderCount = files.filter(dirent => dirent.isDirectory()).length;
        res.json({ count: folderCount });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
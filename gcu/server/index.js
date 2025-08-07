const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const archiveDirPath = path.resolve(__dirname, '..', '_archive');
app.use('/_archive', express.static(archiveDirPath));

// Endpoint to count files (optional, but good to keep)
app.get('/api/file-count', (req, res) => {
    fs.readdir(archiveDirPath, { withFileTypes: true }, (err, dirents) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Unable to read directory' });
        }
        const fileCount = dirents.filter(dirent => dirent.isFile()).length;
        res.json({ count: fileCount });
    });
});

// Endpoint to list all files
app.get('/api/files', (req, res) => {
    fs.readdir(archiveDirPath, { withFileTypes: true }, (err, dirents) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Unable to read directory' });
        }
        const files = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
        res.json({ files });
    });
});

// New endpoint to get the newest file
app.get('/api/newest-file', async (req, res) => {
    try {
        const dirents = await fs.promises.readdir(archiveDirPath, { withFileTypes: true });
        const files = dirents.filter(dirent => dirent.isFile());

        if (files.length === 0) {
            return res.json({ fileName: null, fileUrl: null });
        }

        // Use Promise.all to get stats for all files concurrently
        const fileStats = await Promise.all(
            files.map(async (dirent) => ({
                name: dirent.name,
                stats: await fs.promises.stat(path.join(archiveDirPath, dirent.name))
            }))
        );

        // Find the file with the newest modification time (mtime)
        const newestFile = fileStats.reduce((prev, current) => {
            return (prev.stats.mtime > current.stats.mtime) ? prev : current;
        });

        // Construct the URL for the newest file
        const fileUrl = `/_archive/${newestFile.name}`;

        res.json({ fileName: newestFile.name, fileUrl });
    } catch (err) {
        console.error('Error reading directory for newest file:', err);
        res.status(500).json({ error: 'Unable to read directory' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

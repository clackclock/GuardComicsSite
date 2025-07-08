const express = require('express');
const multer = require('multer');
const app = express();
const port = 5000;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully: ' + req.file.filename);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
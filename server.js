const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); 

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/rooms'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

app.use(express.static('public'));

app.post('/api/rooms/upload-image', upload.single('image'), (req, res) => {
  res.json({ imagePath: `/uploads/rooms/${req.file.filename}` });
});

app.listen(3002, () => {
  console.log('Image upload server listening on http://localhost:3002');
});

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create necessary directories
const directories = ['uploads', 'processed', 'public/css', 'public/js', 'public/images'];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.ensureDirSync(dirPath);
  }
});

// Import controllers
const homeController = require('./controllers/homeController');
const uploadController = require('./controllers/uploadController');
const mergeController = require('./controllers/mergeController');
const convertController = require('./controllers/convertController');
const rotateController = require('./controllers/rotateController');
const deleteController = require('./controllers/deleteController');

// Routes
app.get('/', homeController.getHome);
app.get('/upload', uploadController.getUploadPage);
app.post('/upload', uploadController.uploadFile);
app.get('/merge', mergeController.getMergePage);
app.post('/merge', mergeController.mergePDFs);
app.get('/convert', convertController.getConvertPage);
app.post('/convert', convertController.convertDocument);
app.get('/rotate', rotateController.getRotatePage);
app.post('/rotate', rotateController.rotatePDF);
app.get('/delete', deleteController.getDeletePage);
app.delete('/delete/:filename', deleteController.deleteFile);
app.get('/files', deleteController.listFiles);
app.get('/download/:filename', uploadController.downloadFile);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Document Manager running on http://localhost:${PORT}`);
  console.log(`Upload directory: ${path.join(__dirname, 'uploads')}`);
});
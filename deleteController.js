const path = require('path');
const fs = require('fs-extra');

exports.getDeletePage = async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../uploads');
    let files = [];
    
    if (fs.existsSync(uploadPath)) {
      files = await fs.readdir(uploadPath);
      // Get file details
      files = await Promise.all(files.map(async (file) => {
        const filePath = path.join(uploadPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          size: (stats.size / 1024).toFixed(2) + ' KB',
          modified: stats.mtime.toLocaleDateString(),
          ext: path.extname(file)
        };
      }));
    }
    
    res.render('delete', {
      title: 'Manage Files',
      files
    });
  } catch (error) {
    console.error('Error loading delete page:', error);
    res.status(500).render('error', { message: 'Error loading delete page' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../uploads');
    let files = [];
    
    if (fs.existsSync(uploadPath)) {
      files = await fs.readdir(uploadPath);
    }
    
    res.json({
      success: true,
      files: files.map(file => ({
        name: file,
        size: 'N/A'
      }))
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files'
    });
  }
};
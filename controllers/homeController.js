const path = require('path');
const fs = require('fs-extra');

exports.getHome = async (req, res) => {
  try {
    // Get file statistics
    const uploadPath = path.join(__dirname, '../uploads');
    let fileCount = 0;
    let totalSize = 0;
    
    if (fs.existsSync(uploadPath)) {
      const files = await fs.readdir(uploadPath);
      fileCount = files.length;
      
      for (const file of files) {
        const filePath = path.join(uploadPath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
    
    res.render('home', {
      title: 'Document Manager - Home',
      fileCount,
      totalSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('error', { message: 'Error loading home page' });
  }
};

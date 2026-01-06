const path = require('path');
const fs = require('fs-extra');

exports.getConvertPage = async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../uploads');
    let files = [];
    
    if (fs.existsSync(uploadPath)) {
      files = await fs.readdir(uploadPath);
    }
    
    res.render('convert', {
      title: 'Convert Document',
      files: files.map(file => ({
        name: file,
        ext: path.extname(file).toLowerCase()
      }))
    });
  } catch (error) {
    console.error('Error loading convert page:', error);
    res.status(500).render('error', { message: 'Error loading convert page' });
  }
};

exports.convertDocument = async (req, res) => {
  try {
    const { filename, convertTo } = req.body;
    
    if (!filename || !convertTo) {
      return res.status(400).json({
        success: false,
        message: 'Filename and conversion type are required'
      });
    }
    
    const uploadPath = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadPath, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // For demo purposes - in real app, use libraries like libreoffice-convert
    const ext = path.extname(filename).toLowerCase();
    let message = '';
    
    if (convertTo === 'pdf' && ['.doc', '.docx', '.txt'].includes(ext)) {
      message = `Converted ${filename} to PDF format (simulated)`;
    } else if (convertTo === 'docx' && ext === '.pdf') {
      message = `Converted ${filename} to DOCX format (simulated)`;
    } else {
      return res.status(400).json({
        success: false,
        message: `Cannot convert ${ext} to ${convertTo}`
      });
    }
    
    // Simulate file conversion by copying
    const outputFilename = `${path.parse(filename).name}.${convertTo}`;
    const outputPath = path.join(__dirname, '../processed', outputFilename);
    
    await fs.copy(filePath, outputPath);
    
    res.json({
      success: true,
      message: message,
      filename: outputFilename,
      downloadLink: `/download/${outputFilename}`
    });
    
  } catch (error) {
    console.error('Error converting document:', error);
    res.status(500).json({
      success: false,
      message: 'Error converting document'
    });
  }
};

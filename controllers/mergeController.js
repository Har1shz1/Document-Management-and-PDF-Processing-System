const path = require('path');
const fs = require('fs-extra');
const { PDFDocument } = require('pdf-lib');

exports.getMergePage = async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../uploads');
    let files = [];
    
    if (fs.existsSync(uploadPath)) {
      files = await fs.readdir(uploadPath);
      files = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    }
    
    res.render('merge', {
      title: 'Merge PDFs',
      files: files.map(file => ({
        name: file,
        path: `/uploads/${file}`
      }))
    });
  } catch (error) {
    console.error('Error loading merge page:', error);
    res.status(500).render('error', { message: 'Error loading merge page' });
  }
};

exports.mergePDFs = async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!files || !Array.isArray(files) || files.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least 2 PDF files to merge'
      });
    }
    
    const mergedPdf = await PDFDocument.create();
    const uploadPath = path.join(__dirname, '../uploads');
    
    // Merge all selected PDFs
    for (const filename of files) {
      const filePath = path.join(uploadPath, filename);
      if (fs.existsSync(filePath)) {
        const pdfBytes = await fs.readFile(filePath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
    }
    
    // Save merged PDF
    const mergedBytes = await mergedPdf.save();
    const outputFilename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '../processed', outputFilename);
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, mergedBytes);
    
    res.json({
      success: true,
      message: 'PDFs merged successfully',
      filename: outputFilename,
      downloadLink: `/download/${outputFilename}`
    });
    
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({
      success: false,
      message: 'Error merging PDFs'
    });
  }
};

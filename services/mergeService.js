const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const uploadDir = path.join(__dirname, "../uploads");

exports.mergePdfs = async (files) => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  const outputFile = `merged_${Date.now()}.pdf`;
  const outputPath = path.join(uploadDir, outputFile);

  fs.writeFileSync(outputPath, mergedBytes);
  return outputFile;
};

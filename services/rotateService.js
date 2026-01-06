const fs = require("fs");
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");

const uploadDir = path.join(__dirname, "../uploads");

exports.rotatePdf = async (fileName, angle) => {
  const inputPath = path.join(uploadDir, fileName);
  const pdfBytes = fs.readFileSync(inputPath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + angle));
  });

  const outputFile = `rotated_${angle}_${fileName}`;
  const outputPath = path.join(uploadDir, outputFile);

  const rotatedBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, rotatedBytes);

  return outputFile;
};

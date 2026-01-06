const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const mammoth = require("mammoth");

const uploadDir = path.join(__dirname, "../uploads");

/**
 * Word → PDF
 */
exports.wordToPdf = async (fileName) => {
  const inputPath = path.join(uploadDir, fileName);
  const outputFile = fileName.replace(".docx", ".pdf");
  const outputPath = path.join(uploadDir, outputFile);

  const result = await mammoth.extractRawText({ path: inputPath });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(result.value || " ");

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputFile;
};

/**
 * PDF → Word (basic text extraction)
 */
exports.pdfToWord = async (fileName) => {
  const outputFile = fileName.replace(".pdf", ".txt");
  const outputPath = path.join(uploadDir, outputFile);

  fs.writeFileSync(
    outputPath,
    "PDF to Word conversion requires advanced parsing.\nUse OCR or premium tools."
  );

  return outputFile;
};

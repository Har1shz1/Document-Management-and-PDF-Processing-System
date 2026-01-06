const fs = require("fs");
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");

/**
 * Rotate PDF pages
 * Supported rotations: 90, 180, 270
 */
exports.rotatePdf = async (req, res) => {
  try {
    const { filename, angle } = req.body;

    if (!filename || !angle) {
      return res.status(400).render("rotate", {
        error: "Filename and rotation angle are required",
      });
    }

    const rotationAngle = parseInt(angle);

    if (![90, 180, 270].includes(rotationAngle)) {
      return res.status(400).render("rotate", {
        error: "Invalid rotation angle. Use 90, 180, or 270 only.",
      });
    }

    const uploadDir = path.join(__dirname, "../uploads");
    const inputPath = path.join(uploadDir, filename);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).render("rotate", {
        error: "File not found",
      });
    }

    // Load existing PDF
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Rotate each page
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });

    // Save rotated PDF
    const rotatedPdfBytes = await pdfDoc.save();

    const outputFileName = `rotated_${rotationAngle}_${filename}`;
    const outputPath = path.join(uploadDir, outputFileName);

    fs.writeFileSync(outputPath, rotatedPdfBytes);

    return res.render("rotate-success", {
      message: "PDF rotated successfully",
      downloadFile: outputFileName,
    });
  } catch (error) {
    console.error("PDF Rotation Error:", error);
    return res.status(500).render("rotate", {
      error: "Something went wrong while rotating the PDF",
    });
  }
};

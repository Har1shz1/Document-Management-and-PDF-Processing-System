const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");

const uploadDir = path.join(__dirname, "../uploads");

router.get("/pdf-to-excel", (req, res) => {
  res.render("pdf-to-excel");
});

router.post("/pdf-to-excel", async (req, res) => {
  try {
    if (!req.files || !req.files.pdfFile) {
      return res.render("pdf-to-excel", {
        error: "Please upload a PDF file",
      });
    }

    const pdfFile = req.files.pdfFile;
    const pdfPath = path.join(uploadDir, pdfFile.name);
    await pdfFile.mv(pdfPath);

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    const rows = pdfData.text
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => line.split(/\s{2,}|\t/));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const outputFile = pdfFile.name.replace(".pdf", ".xlsx");
    const outputPath = path.join(uploadDir, outputFile);

    XLSX.writeFile(workbook, outputPath);

    res.render("pdf-to-excel", {
      success: "PDF converted to Excel successfully",
      downloadFile: outputFile,
    });
  } catch (error) {
    console.error(error);
    res.render("pdf-to-excel", {
      error: "Failed to convert PDF to Excel",
    });
  }
});

module.exports = router;

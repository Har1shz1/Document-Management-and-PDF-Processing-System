const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { fromPath } = require("pdf2pic");

const uploadDir = path.join(__dirname, "../uploads");

router.get("/pdf-to-image", (req, res) => {
  res.render("pdf-to-image");
});

router.post("/pdf-to-image", async (req, res) => {
  try {
    if (!req.files || !req.files.pdfFile) {
      return res.render("pdf-to-image", {
        error: "Please upload a PDF file",
      });
    }

    const pdfFile = req.files.pdfFile;
    const pdfPath = path.join(uploadDir, pdfFile.name);
    await pdfFile.mv(pdfPath);

    const outputDir = path.join(uploadDir, `images_${Date.now()}`);
    fs.mkdirSync(outputDir);

    const options = {
      density: 150,
      saveFilename: "page",
      savePath: outputDir,
      format: "png",
      width: 1240,
      height: 1754
    };

    const convert = fromPath(pdfPath, options);
    const totalPages = await convert.bulk(-1);

    res.render("pdf-to-image", {
      success: "PDF converted to images successfully",
      outputPath: outputDir,
      pages: totalPages.length
    });

  } catch (error) {
    console.error(error);
    res.render("pdf-to-image", {
      error: "Failed to convert PDF to images",
    });
  }
});

module.exports = router;

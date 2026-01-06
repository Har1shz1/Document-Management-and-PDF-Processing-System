const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

exports.deleteFile = (fileName) => {
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  fs.unlinkSync(filePath);
  return true;
};

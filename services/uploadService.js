const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.saveFile = (file) => {
  const filePath = path.join(uploadDir, file.name);
  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
};

exports.getAllFiles = () => {
  return fs.readdirSync(uploadDir);
};

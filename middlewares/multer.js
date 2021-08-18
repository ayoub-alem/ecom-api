const multer = require('multer');
const fs = require('fs');
const path = require('path');
//value of the name attribute of the file input in your frontEnd
const fileName = 'file';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage }).single(fileName);

function uploadMiddleware(req, res, next) {
  return upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return;
    } else if (err) {
      return res.status(500).json(err);
    }
    next();
  });
}

function removeFile(filePath) {
  fs.unlink(path.join(__dirname, '../', filePath), (err) => {
    return;
  });
}

module.exports = {
  uploadMiddleware,
  removeFile,
};

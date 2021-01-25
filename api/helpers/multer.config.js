const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'tmp',
  filename: function (req, file, cb) {
    const fileExtention = path.parse(file.originalname).ext;
    cb(null, shortid.generate() + fileExtention);
  },
});

const upload = multer({ storage });

module.exports = upload;

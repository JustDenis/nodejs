const { promises: fsPromises } = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function minifyImage(req, res, next) {
  try {
    const DESTINATION_DIR = path.join('public', 'images');
    const { filename, path: tmpFilePath } = req.file;

    await imagemin([`tmp/${filename}`], {
      destination: DESTINATION_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    await fsPromises.unlink(tmpFilePath);

    req.file = {
      ...req.file,
      path: path.join(DESTINATION_DIR, filename),
      destination: DESTINATION_DIR,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = minifyImage;

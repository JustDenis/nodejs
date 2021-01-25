const Avatar = require('avatar-builder');
const shortid = require('shortid');
const {promises: fsPromises} = require('fs');
const path = require('path');

async function generateAvatar()  {

  const avatar = Avatar.squareBuilder(128);

  const avatarFile = await avatar.create('gabriel');

  const avatarName = `${shortid.generate()}.png`;

  const avatarPath  = path.join('tmp', avatarName);

  await fsPromises.writeFile(avatarPath, avatarFile);
  const destPath = path.join('public','images', avatarName);
  await fsPromises.copyFile(avatarPath, destPath);
  await fsPromises.unlink(avatarPath);

  return avatarName;
}

module.exports = generateAvatar;

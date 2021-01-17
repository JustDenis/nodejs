const userModel = require('../users/users.model');

exports.authorize = async function(req, res, next) {
  try {
    const authorizationHeader = req.get('Authorization') || '';
    const [,token] = authorizationHeader.split(' ');

    let userId;

    try {
      userId = await userModel.verifyToken(token).id;
    } catch (error) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    const user = await userModel.findById(userId);

    if (!user || user.token !== token) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

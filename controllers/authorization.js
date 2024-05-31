const redisClient = require("./signin").redisClient;

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }

  try {
    const token = authorization.split(" ")[1];
    const reply = await redisClient.get(token);
    if (!reply) {
      return res.status(401).json("Unauthorized");
    }
    return next();
  } catch (err) {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = {
  requireAuth,
};

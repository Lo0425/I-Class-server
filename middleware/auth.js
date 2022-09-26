const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, "AlwaysReady");
    req.user = decoded.data;
    next();
  } catch {
    return res.status(401).json({
      err,
      msg: "unauthorized",
    });
  }
};

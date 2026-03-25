import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const verified = jwt.verify(token, "secretkey123");
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }

};

export default authMiddleware;
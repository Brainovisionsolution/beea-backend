import jwt from "jsonwebtoken";

const SECRET = "your_secret_key";

export const generateToken = (email) => {
  return jwt.sign({ email }, SECRET, { expiresIn: "15m" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
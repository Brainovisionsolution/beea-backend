import { db } from "../config/db.js";

export const getDashboard = (req, res) => {
  const { email } = req.query;

  db.query(
    "SELECT * FROM nominations WHERE email=?",
    [email],
    (err, result) => {
      if (err || result.length === 0)
        return res.status(404).json({ message: "Not found" });

      res.json(result[0]);
    }
  );
};
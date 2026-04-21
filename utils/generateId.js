export const generateNominationId = async (db) => {
  const year = new Date().getFullYear();

  return new Promise((resolve, reject) => {
    db.query(
      "SELECT COUNT(*) as count FROM nominations",
      (err, result) => {
        if (err) return reject(err);

        const count = result[0].count + 1;
        const id = `BEEA-${year}-${String(count).padStart(4, "0")}`;

        resolve(id);
      }
    );
  });
};
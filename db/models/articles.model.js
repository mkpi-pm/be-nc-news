const db = require("../connection");

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.updateArticleById = (newVote, id) => {
  return db
    .query(
      `UPDATE articles
       SET
       votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [newVote, id]
    )
    .then(({ rows }) => {
      if (isNaN(rows[0].votes)) {
        return Promise.reject({
          status: 400,
          msg: `${rows[0].votes} is not a number`,
        });
      }
      if (!rows[0].votes) {
        return Promise.reject({
          status: 404,
          msg: "not found",
        });
      }
      const updatedVotes = rows[0];
      return updatedVotes;
    });
};

const db = require("../connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

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

exports.updateArticleById = (id, newVote) => {
  return db
    .query(
      `UPDATE articles
       SET
       votes = votes + $2
       WHERE article_id = $1
       RETURNING *;`,
      [id, newVote]
    )
    .then((updatedVotesObj) => {
      const updatedVotes = updatedVotesObj.rows[0];
      return updatedVotes;
    });
};

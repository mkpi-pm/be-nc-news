const db = require("../connection");

exports.fetchComments = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.article_id, comments.body, comments.votes, comments.author, comments.created_at
      FROM comments
      WHERE comments.article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};

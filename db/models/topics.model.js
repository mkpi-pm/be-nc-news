const db = require("../connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return response.rows;
  });
};

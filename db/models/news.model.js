const db = require("../connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    // console.log(response.rows);
    return response.rows;
  });
};

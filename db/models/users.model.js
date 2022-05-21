const db = require("../connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return response.rows;
  });
};

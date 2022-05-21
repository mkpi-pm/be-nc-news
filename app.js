const express = require("express");
const app = express();
const { getTopics } = require("./db/controllers/topics.controllers");
const { getUsers } = require("./db/controllers/users.controllers");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./db/controllers/articles.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "not a route" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;

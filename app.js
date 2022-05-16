const express = require("express");
const app = express();
const { getTopics } = require("./db/controllers/news.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;

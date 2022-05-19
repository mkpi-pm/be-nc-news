const articles = require("../data/test-data/articles");
const {
  fetchArticleById,
  updateArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleById(inc_votes, article_id)
    .then((updatedVotes) => {
      res.status(201).send({ updatedVotes });
    })
    .catch((err) => {
      next(err);
    });
};

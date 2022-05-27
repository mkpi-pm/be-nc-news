const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.params;
  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

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
      res.status(200).send({ updatedVotes });
    })
    .catch((err) => {
      next(err);
    });
};

const topics = require("../data/test-data/topics");
const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
} = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
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
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((updatedVotes) => {
      res.status(201).send({ updatedVotes });
    })
    .catch((err) => {
      next(err);
    });
};

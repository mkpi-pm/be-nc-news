const topics = require("../data/test-data/topics");
const {
  fetchTopics,
  // fetchArticleById,
  // updateArticleById,
} = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

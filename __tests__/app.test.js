process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
const { convertTimestampToDate } = require("../db/helpers/utils");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("200: Returns an array of topic objects, each with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Returns an array of user objects, each with username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
  test("404: Responds with an error message when passed a route which is not valid", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not a route");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Returns an array of article objects, each with article_id, title, topic, author, created_at, votes, and comment_count (sorted by date in descending order)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: Responds with an error message when passed a sort query which is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: Responds with an error message when passed a route which is not valid", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not a route");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Returns an article object with properties of article_id, title, topic, author, body, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const formattedResponse = convertTimestampToDate(body.article);
        expect(formattedResponse).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(Date),
            votes: 100,
          })
        );
      });
  });
  test("200: Returns total count of all comments with requested article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_count: 11,
          })
        );
      });
  });
  test("400: Returns the bed request message when passed an invalid article id", () => {
    return request(app)
      .get("/api/articles/havoc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: Returns the not found message when passed article which is not in db", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("200: Returns an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author which is the username from the users table, and body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/articles/:article_id ", () => {
  test("200: Returns an object with updated votes property by the provided number", () => {
    const req = { inc_votes: 56 };
    const expected = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: expect.any(Date),
      votes: 156,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(req)
      .expect(200)
      .then(({ body }) => {
        const formattedResponse = convertTimestampToDate(body.updatedVotes);
        expect(formattedResponse).toEqual(expected);
      });
  });
  test("400: Responds with an error message when passed a bad user ID", () => {
    const req = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/notAnID")
      .send(req)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: Responds with an error message when passed no key", () => {
    const req = {};
    return request(app)
      .patch("/api/articles/1")
      .send(req)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: Responds with an error message when inc_vote not an integer", () => {
    const req = { inc_votes: "three" };
    return request(app)
      .patch("/api/articles/1")
      .send(req)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: Returns the not found message when passed article id that doesn't exist", () => {
    const req = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/99999999")
      .send(req)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

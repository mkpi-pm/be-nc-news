process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
const { convertTimestampToDate } = require("../db/helpers/utils");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("/api/topics", () => {
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
  describe("/api/articles/:article_id", () => {
    test("200: Returns an article object with properties of author, title, article_id, body, topic, created_at, votes", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const formattedResponse = convertTimestampToDate(body.article);
          expect(formattedResponse).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(Date),
            votes: 100,
          });
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
  });
});

describe("PATCH /api/articles/:article_id ", () => {
  test("201: returns an object with updated votes property by the provided number", () => {
    const req = { inc_votes: 3 };
    const expected = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: expect.any(Date),
      votes: 103,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(req)
      .expect(201)
      .then(({ body }) => {
        const formattedResponse = convertTimestampToDate(body.updatedVotes);
        expect(formattedResponse).toEqual(expected);
      });
  });
  test("404: Returns the not found message when passed article id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

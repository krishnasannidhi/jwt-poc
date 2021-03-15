require("dotenv").config();

const { response } = require("express");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return response.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      response.sendStatus(403);
    }
    request.user = user;
    next();
  });
};

const posts = [
  { username: "krishna", title: "post1" },
  { username: "sannidhi", title: "post2" },
];
app.get("/posts", authenticateToken, (request, response) => {
  response.json(posts.filter((post) => post.username === request.user.name));
});

app.listen(3000);

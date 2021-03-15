require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let refreshTokens = [];
app.use(express.json());

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

app.post("/token", (request, response) => {
  const refreshToken = request.body.token;

  if (refreshToken == null) return response.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return response.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    response.json({ accessToken });
  });
});

app.delete("/logout", (request, response) => {
  refreshTokens = refreshTokens.filter((token) => token !== request.body.token);
  response.sendStatus(204);
});

app.post("/login", (request, response) => {
  //authenticate user

  const username = request.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  response.json({ accessToken, refreshToken });
});

app.listen(4000);

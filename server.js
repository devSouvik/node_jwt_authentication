require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const posts = [
  {
    username: "max",
    title: "my first post",
  },
  {
    username: "jim",
    title: "my second post",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  // passoword authentication to be applied here

  let username = req.body.username;
  let user = { name: username }; // this is for serialization of the token, the payload to be stored inside the token

  const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); // "user" i.e. the payload will be added to the token, used for serialization of the token under the key name of "name"
  res.json({ accesstoken: accesstoken }); // return the accesstoken
});

// middleware function
function authenticateToken(req, res, next) {
  let authHeader = req.headers["authorization"]; // the value under the name of "authorization" will be stored here.
  let token = authHeader && authHeader.split(" ")[1]; // the authHeader contains a bearer part and a token part seperated by space, token part is extrated here.

  // check if there's a token or not
  if (token == null) {
    res.sendStatus(401);
  } else {
    // check if the token is valid i.e. matches with the original token...
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      // console.log(err);
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = user; //
        console.log(user);
        next();
      }
    });
  }
}

app.listen(3000, () => {
  console.log("server running on 3000");
});

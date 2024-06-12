const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  for (let user of users) {
    if (user.username == username) {
      return false;
    }
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access-token", { expiresIn: "1h" });
    req.session.authorization = token;
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review = req.query.review;
  let isbn = req.params.isbn;
  const { username } = req.user;
  books[`${isbn}`].reviews = {
    ...books[`${isbn}`].reviews,
    [username]: review,
  };

  return res
    .status(200)
    .json({ message: "Your review has been added", review, books });
});

//Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const { username } = req.user;
  let reviews = books[`${isbn}`].reviews;
  if (reviews[username]) {
    delete reviews[username];
    return res.status(200).json({
      message: `Your review for the book having isbn: ${isbn} has been removed`,
      books,
    });
  } else {
    return res.status(400).json({
      message: `There aren't any reviews of yours!!`,
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

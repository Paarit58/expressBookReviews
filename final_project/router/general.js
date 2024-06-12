const express = require("express");
let books = require("./booksdb.js");
const { default: axios } = require("axios");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bookArray = Object.values(books);

public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!isValid(username)) {
    return res.status(400).send("The username already exists");
  } else if (!username || !password) {
    return res.status(400).send("Please provide your username and password");
  } else {
    users.push({ username, password });

    return res.status(200).send(`${username} has been registered`);
    // return res.status(200).send(users);
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  return res.status(200).json(books);
});

//Get method using axios
axios
  .get("http://localhost:5000")
  .then((response) => {
    console.log("GET response:", response.data);
  })
  .catch((error) => {
    console.error("Error making GET request:", error);
  });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  // Since isbn proprty is not given in booksdb.js so index itself is considered as isbn number
  return res.status(200).json(books[isbn]);
});

//get request for book based on isbn using axios
axios
  .get("http://localhost:5000/isbn/1")
  .then((response) => {
    console.log("GET response:", response.data);
  })
  .catch((error) => {
    console.error("Error making GET request:", error);
  });

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;

  let filteredBook = bookArray.filter((book) => book.author === author);

  return res.status(200).json(filteredBook);
});


// get request for book based on author using axios
axios
  .get("http://localhost:5000/author/Samuel Beckett")
  .then((response) => {
    console.log("GET response:", response.data);
  })
  .catch((error) => {
    console.error("Error making GET request:", error);
  });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;

  let filteredBook = bookArray.filter((book) => book.title === title);

  return res.status(200).json(filteredBook);
});


//get request for book based on title using axios
axios
  .get(`http://localhost:5000/title/Things Fall Apart`)
  .then((response) => {
    console.log("GET response:", response.data);
  })
  .catch((error) => {
    console.error("Error making GET request:", error);
  });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  // Since isbn proprty is not given in booksdb.js so index itself is considered as isbn number

  return res.status(200).json(bookArray[isbn].reviews);
});



//get request for book review using axios
axios
  .get(`http://localhost:5000/review/1`)
  .then((response) => {
    console.log("GET response:", response.data);
  })
  .catch((error) => {
    console.error("Error making GET request:", error);
  });

module.exports.general = public_users;

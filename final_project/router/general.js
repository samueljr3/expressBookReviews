const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let results = [];

  const keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]].author === author) {
      results.push(books[keys[i]]);
    }
  }

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  }
  return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let results = [];

  const keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]].title === title) {
      results.push(books[keys[i]]);
    }
  }

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  }
  return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

public_users.get('/axios/books', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error getting the list of books"});
  }
});

public_users.get('/axios/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/isbn/" + encodeURIComponent(isbn));
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
});

public_users.get('/axios/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/author/" + encodeURIComponent(author));
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({message: "No books found for this author"});
  }
});

public_users.get('/axios/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/title/" + encodeURIComponent(title));
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({message: "No books found with this title"});
  }
});

module.exports.general = public_users;

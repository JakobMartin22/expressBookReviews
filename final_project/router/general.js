const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const doesExist = users.some((user) => user.username === username);
    if (!doesExist) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: `${username} successfully registred.`});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  }
  else {
  return res.status(300).json({message: "ISBN Not Found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const findAuthor = req.params.author;
  const matchBooks = [];

  //obtain all isbn for books object
  for (const isbn of Object.keys(books)) {
      const book = books[isbn];

  if (book.author === findAuthor) {
    matchBooks.push(book);
  }
}

 if (matchBooks.length > 0) {
     res.json(matchBooks);
 } else {
  return res.status(300).json({message: "No books found by this Author Found"});
  }
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const findTitle = req.params.title;
  const matchBooks = [];

  //obtain isbn for books object
  for (const isbn of Object.keys(books)) {
      const book = books[isbn];

  if (book.title === findTitle) {
    matchBooks.push(book);
  }
}

 if (matchBooks.length > 0) {
     res.json(matchBooks);
 } else {
  return res.status(300).json({message: "No Books with this Title Found"});
  }
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const findISBN = req.params.isbn;

  if (books[findISBN]) {
      const thisReview = books[findISBN].reviews;
      res.json(thisReview);
  } else {
  return res.status(300).json({message: "This book could not be found"});
  }
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 

let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send(`${username} successfully logged in`);
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  // Find book
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    let book = books[isbn];
    
    // Check existing review
    const reviewId = username; 
    const reviewText = req.body.review;
    
    if (reviewText === undefined || reviewText.trim() === "") {
      return res.status(400).json({ message: "Review text is required." });
    }
    
    // Add review
    book.reviews[reviewId] = {
      username: username,
      text: reviewText
    };
    
    // check add or modify
    if (book.reviews[reviewId]) {
      return res.status(200).json({ message: "Review modified successfully." });
    } else {
      return res.status(200).json({ message: "Review added successfully." });
    }
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

//Delete Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write code here
    const username = req.session.authorization.username;

  // Find book
  const isbn = req.params.isbn;

  if (books[isbn]) {
    let book = books[isbn];

    // check existing review
    if (book.reviews.hasOwnProperty(username)) {
      // Delete review
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found for this book." });
    }
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

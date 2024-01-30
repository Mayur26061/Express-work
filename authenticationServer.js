/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the
let signupData = [];
app.use(bodyParser.json());
app.use("/data", (req, res, next) => {
  let username = req.headers.username;
  let password = req.headers.password;
  let authIndex = signupData.findIndex(
    (data) => data.username === username && data.password === password
  );
  console.log(authIndex);
  if (authIndex < 0) {
    return res.status(401).send("Unauthorized");
  }
  next();
});
app.post("/signup", (req, res) => {
  let firstName = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let password = req.body.password;
  let check = signupData.filter((data) => data.username === username).length;
  let err = { error: "Bad request" };
  if (!check) {
    if (firstName && lastname && username && password) {
      signupData.push({ firstName, lastname, username, password });
      return res.status(201).send("Created");
    } else {
      err.error = "Please enter all details";
    }
  }
  res.status(400).send(err);
});
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    let checkIndex = signupData.findIndex(
      (data) => data.username === username && data.password === password
    );
    if (checkIndex > -1) {
      let userData = signupData[checkIndex];
      return res.send({
        firstname: userData.firstName,
        lastname: userData.lastname,
      });
    }
    res.status(401).send("Unauthorized");
  }
});
app.get("/data", (req, res) => {
  let datas = signupData.map((data) => {
    return {
      firstname: data.firstName,
      lastname: data.lastname,
    };
  });
  let obj = {
    users: datas,
  };
  res.json(obj);
});
app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});
app.listen(PORT, () => {
  console.log("Server is running");
});

module.exports = app;

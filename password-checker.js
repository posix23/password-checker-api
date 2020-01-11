const express = require("express");
const app = express();
const multer = require("multer");
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(multer().none());
const fs = require("fs").promises;
const util = require("util");
const glob = require("glob");
const globPromise = util.promisify(glob);
const bcrypt = require("bcrypt");

app.post("/password/save", async (req, res) => {
  res.type("text");
  if (req.body.user) {
    let user = req.body.user;
    if (req.body.password) {
      let passwd = req.body.password;
      try {
        passwd = await encryptPasswd(passwd);

        // Check if the user exists. If not, this will add the user into the database
        if (!(await userExist(user))) { // If the user doesn't exist
          let data = {};
          data.username = user;
          data.password = passwd;
          data = JSON.stringify(data);
          await fs.writeFile("user-info/" + user + ".json", data);
          res.send("User has been saved!");
        } else {
          res.status(500).send("User has already existed!");
        }
      } catch (error) {
        res.status(500).send("An internal server error has occured.");
      }
    } else {
      res.status(400).send("Missing the password parameter.");
    }
  } else {
    res.status(400).send("Missing the user parameter.");
  }
});

/**
 * This function will return the hashed password
 * @param {string} password - the password
 * @return {string} - a hashed password
 */
async function encryptPasswd(password) {
  let salt = await bcrypt.genSalt();
  let hashed = await bcrypt.hash(password, salt);

  return hashed;
}

/**
 * This function will return true if the username is already in the database
 * @param {string} username - the username
 * @return {boolean} - true if the username exists
 */
async function userExist(username) {
  let files = await globPromise("user-info/" + username + "*");
  if (files.length === 0) {
    return false;
  }

  return true;
}

app.post("/password/login", async (req, res) => {
  res.type("text");
  if (req.body.user) {
    if (req.body.password) {
      try {
        if (await userExist) { // User exists
          let userPwd = await fs.readFile("user-info/" + req.body.user + ".json", "utf8");
          userPwd = JSON.parse(userPwd);
          if (await bcrypt.compare(req.body.password, userPwd.password)) {
            res.send("Success");
          } else {
            res.send("Wrong password");
          }
        }
      } catch (error) {
        res.status(500).send("An internal server error has occured.");
      }
    } else {
      res.status(400).send("Missing the password parameter.");
    }
  } else {
    res.status(400).send("Missing the user parameter.");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
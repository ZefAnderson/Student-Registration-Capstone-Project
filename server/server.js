const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3002;
const app = express();
const query = require("./queries")
const {expressjwt} = require('express-jwt')
const morgan = require('morgan');
const winston = require('winston');

console.log(`jwt-secret: ${process.env.SECRET}`)
const auth = expressjwt({
  secret: process.env.SECRET,
  algorithms: ['HS256']
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ]
});

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use(express.json());

app.use(morgan('tiny'));

app.get("/api", (req, res) => {
  res.json({ message: "Hello there!" })
})

app.post("/api/login", query.login);

app.post("/api/registration", query.addUser);

app.get("/api/courses", query.displayCourses);

app.get("/api/userprofile", auth, query.getUser);

app.post("/api/updateuser", auth, query.updateUser);

app.post("/api/adminupdate", query.updatePerAdmin);

app.post("/api/registerforcourse", query.registerUserForCourse);

app.post("/api/usercourses", auth, query.getUserCourses);

app.get("/api/userlist", query.getUserList);

app.post("/api/delete", query.deleteUser);

app.delete("/api/dropcourse", auth, query.dropUserCourse);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

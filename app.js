require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
const morgan = require('morgan');
const Users = require("./modules/dataschemas");
const bcrypt = require('bcrypt');

const saltRounds = precess.env.saltRounds;

app.set("view engine", "ejs");
app.use(express.urlencoded({

   extended: true

}));
app.use("/public", express.static(__dirname + "/public"));

mongoose.connect(process.env.MongoDB_DB_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once('open',()=>{
   console.log("Successfully Connected to Database")
})


app.listen(port, (req, res) => {
   console.log("your server is running on port: " + port);
});

app.use(morgan('dev'));

app.route("/")

   .get((req, res) => {

      res.render("home");
   });

app.route("/register")

   .get((req, res) => {
      res.render("register")

   })
   .post((req, res) => {

      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

         const newuser = new Users({

            email: req.body.username,
            password: hash
   
         })
         newuser.save((err) => {
            if (err) console.log(err);
            else res.render("secrets");
         });
  
      });   

   });


app.route("/login")

   .get(function (req, res) {
      res.render("login");
   })

   .post((req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      Users.findOne({
         email: username
      }, function (err, foundUser) {
         if (err) {
            console.log(err);
         } else {
            if (foundUser) {
               bcrypt.compare(password, foundUser.password, function(err, result) {
                  if(result === true){

                  res.render("secrets");
               }  else console.log(err);

              });
                  
               
            }

         }

      })

   });


app.use((req, res) => {
   res.status(404).send("Server Error file not available")
});
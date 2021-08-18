require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
const morgan = require('morgan');
const Users = require("./modules/dataschemas");
const session = require('express-session');
const passport = require('passport');

app.set("view engine", "ejs");
app.use(express.urlencoded({

   extended: true

}));
app.use("/public", express.static(__dirname + "/public"));

app.use(session({
   secret: process.env.sessionSecret,
   resave: false,
   saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MongoDB_DB_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', () => {
   console.log("Successfully Connected to Database")
});

passport.use(Users.createStrategy());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.listen(port, (req, res) => {
   console.log("your server is running on port: " + port);
});

app.use(morgan('dev'));

app.route("/")

   .get((req, res) => {

      res.render("home");
   });


app.route("/secrets")
   .get((req, res)=>{
      if(req.isAuthenticated()){
         res.render('secrets');
      } else{
         res.redirect('/login');
      }

   });

app.route("/logout")
   .get((req, res)=>{
      req.logout()
      res.redirect('/');
   })


app.route("/register")

   .get((req, res) => {
      res.render("register")

   })
   .post((req, res) => {

      Users.register({username: req.body.username}, req.body.password, (err, user)=>{
         if(err){
         console.log(err) 
         res.redirect("/register");}
         else{ 
            passport.authenticate("local")(req, res, ()=>{
               console.log("logged in");
               res.redirect("/secrets");

            })
         }

      })

   });


app.route("/login")

   .get(function (req, res) {
      if(req.isAuthenticated()){
         res.redirect('/secrets')
      } else{
      res.render("login");}
   })

   .post((req, res) => {

      const user = new Users({
         username: req.body.username,
         password: req.body.password
      });
      
      req.login(user, (err)=>{
         if(err) console.log(err);
            
         res.redirect('/secrets');
      })
   });


app.use((req, res) => {
   res.status(404).send("Server Error file not available")
});
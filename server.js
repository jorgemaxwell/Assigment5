

/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:  Jorge Barcasnegras Student ID: 156530214 Date: 19-02-2023
*
*  Online (Cycliic) Link: https://good-pink-viper-toga.cyclic.app
*
********************************************************************************/ 

 


var express = require("express");
var bodyParser = require('body-parser')
const collegedata = require('./modules/collegeData.js');
const exphdbs = require('express-handlebars');

var app = express();
var HTTP_PORT = process.env.PORT || 8080;


app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
  next();
});


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs',exphdbs.engine({ extname: '.hbs',
helpers: { 
    navLink: function(url, options){
      return '<li' + 
          ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
          '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
  }
  
  
  },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
  }
  } 
));
app.set('view engine', '.hbs');

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/htmlDemo", (req, res) => {
  res.render('htmlDemo');
});

app.get("/students",(req,res)=>{
  var course=req.query.course
  if (typeof course !== 'undefined') {
      collegedata.getStudentsByCourse(course).then(studentData => {
          res.send(studentData);
        });
    } else {
      collegedata.getAllStudents().then(studentData => {
          res.send(studentData);
        });
    }
});

app.get("/studentsadd", (req,res) => {
  res.render('addStudent');
});

app.post("/studentsadd", (req,res) => {
  collegedata.addStudents(req.body).then(studentData => {
  res.redirect("/students")
  });
});

app.get("/courses",(req,res)=>{
  collegedata.getCourses().then(courseData => {
    res.send(courseData);
  });
});

app.get("/student/:num",(req,res)=>{
  const num = parseInt(req.params.num);
  collegedata.getStudentByNum(num).then(studentData => {
    res.send(studentData);
  });
});

app.get('*', (req, res) => {
  res.status(404).send('Error 404 - page not found');
});





app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`); 
  collegedata.initialize();
});

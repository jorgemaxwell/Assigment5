

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


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs',exphdbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.get("/", (req, res) => {
  res.render(__dirname + '/views/home.hbs');
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(__dirname + '/views/htmlDemo.html');
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
  res.sendFile(__dirname +'/views/addStudent.html');
});

app.post("/studentsadd", (req,res) => {
  collegedata.addStudents(req.body).then(studentData => {
  res.redirect("/students")
  });
});

app.get("/tas",(req,res)=>{
  collegedata.getTAs().then(taData => {
    res.send(taData);
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

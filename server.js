

/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:  Jorge Barcasnegras Student ID: 156530214 Date: 25-03-2023
*
*  Online (Cyclic) Link: ________________________________________________________
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
helpers:{
  navLink:  function(url, options){
                  return '<li' + 
                      ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
                },
  
  equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
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

app.get("/studentsadd", (req,res) => {
  res.render(__dirname +'/views/addStudent.hbs');
});

app.get('/students', (req, res) => {
  collegedata.getAllStudents()
 .then((AllStudents)=> {
   console.log(`Successfully retrieved ${AllStudents.length} students `)  
   // res.send(AllStudents)
   // res.json(AllStudents)
   res.render('students',{
     student:AllStudents,
     // layout:false
   })
   })
 .catch((error)=>res.render('students',{message:"no results"}))
   })

   app.post('/studentsadd', function(req, res){
      
    collegedata.addStudent(req.body)
    .then( res.redirect('/students'))

     });

     app.post("/student/update", (req, res) => {
      console.log(req.body);
      collegedata.updateStudent(req.body)
      .then(
        res.redirect("/students"))
  });
  

app.get('/students/course=:value',(req,res)=>{
   collegedata.getStudentsByCourse(req.params.value)
  .then((filteredStudents)=>{
    console.log(`Successfully retrieved ${filteredStudents.length} students with course ${req.params.value} `) 
    // res.send(filteredStudents)
    res.render('students',{student:filteredStudents})
  
  })
  
    .catch((error)=>res.send({message:"no results"}))
})

// app.get('/tas',(req,res)=>{
//    collegeData.getTAs()
//   .then((filteredStudents)=>{
//     console.log(`Successfully retrieved ${filteredStudents.length} students who are TA `) 
//     res.send(filteredStudents)})
//     .catch((error)=>res.send({message:"no results"}))
// })

app.get('/courses',(req,res)=>{
 
  collegedata.getCourses()
  .then((courses)=>{
    console.log(`Successfully retrieved ${courses.length} number of courses `) 
    // res.send(courses)
    res.render('courses',{
      courses:courses,
      // layout:false
    })
    res
  })
    .catch((error)=>res.send({message:"no results"}))
})


app.get("/course/:id",(req,res)=>{
  if(req.params.id<=0){
      res.send("NO results");
  }else{
      collegedata.getCourseById(req.params.id)
      .then((foundCourse)=>{
        res.render('course', {course: foundCourse}); 
  }).catch(()=>{
      res.render('course', {message: "no results"});
  });
  }
});


app.get('/students/:num',(req,res)=>{
  collegedata.getStudentByNum(req.params.num)
  .then((filteredStudents)=>{
    console.log(`Successfully retrieved 1 students with student No ${req.params.num} `) 
    // res.send(filteredStudents)
    res.render('student',{student:filteredStudents})

  })
    .catch((error)=>res.send({message:"student not found"}))
})


app.get('*', (req, res) => {
  res.status(404).send('Error 404 - page not found');
});





app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`); 
  collegedata.initialize();
});

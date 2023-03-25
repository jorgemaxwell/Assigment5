/*********************************************************************************
*  WEB700 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jorge Barcasnegras Student ID: 156530214 Date: 05-02-2023
*
********************************************************************************/ 

const fs = require("fs");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

 dataCollection = null;

function initialize () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/students.json", "utf8", (err, studentDataFromFile) => {
      if (err) {
        reject("unable to read students.json");
        return;
      }

      fs.readFile("./data/courses.json", "utf8", (err, courseDataFromFile) => {
        if (err) {
          reject("unable to read courses.json");
          return;
        }

         studentData = JSON.parse(studentDataFromFile);
         courseData = JSON.parse(courseDataFromFile);

        dataCollection = new Data(studentData, courseData);
        resolve();
      });
    });
  });
};

function getAllStudents () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length == 0) {
      reject("this query returned didnt return any result");
      return;
    }

    resolve(dataCollection.students);
  });
};

function getTAs () {
  return new Promise((resolve, reject) => {
    var TAs = dataCollection.students.filter(student => student.TA == true);

    if (TAs.length == 0) {
      reject("this query returned didnt return any result");
      return;
    }

    resolve(TAs);
  });
};

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length == 0) {
      reject("this query returned didnt return any result");
      return;
    }

    resolve(dataCollection.courses);
  });
};

function getStudentByNum (num) {
  return new Promise(function (resolve, reject) {
      var foundStudent = null;

      for (let i = 0; i < dataCollection.students.length; i++) {
          if (dataCollection.students[i].studentNum == num) {
              foundStudent = dataCollection.students[i];
          }
      }

      if (!foundStudent) {
          reject("this query returned didnt return any result");
           return;
      }

      resolve(foundStudent);
  });
};

function getStudentsByCourse (course) {
  return new Promise(function (resolve, reject) {
      var filteredStudents = [];

      for (let i = 0; i < dataCollection.students.length; i++) {
          if (dataCollection.students[i].course == course) {
              filteredStudents.push(dataCollection.students[i]);
          }
      }

      if (filteredStudents.length == 0) {
          reject("this query returned didnt return any result");
           return;
      }

      resolve(filteredStudents);
  });
};


module.exports.getStudentByNum = function (num) {
  return new Promise(function (resolve, reject) {
      var foundStudent = null;

      for (let i = 0; i < dataCollection.students.length; i++) {
          if (dataCollection.students[i].studentNum == num) {
              foundStudent = dataCollection.students[i];
          }
      }
      if (!foundStudent) {
          reject("this query returned didnt return any result"); return;
      }

      resolve(foundStudent);
  });
};

module.exports.getCourseById = function (id){
  return new Promise((resolve,reject) =>{
      var foundCourse=[];
      for(let i=0;i < dataCollection.courses.length;i++)
      {
          if(dataCollection.courses[i].courseId==id)
          {
              foundCourse.push(dataCollection.courses[i]);
          }
      }
      if(foundCourse.length<=0){
          reject("this query returned didnt return any result");return;
      }
      else{
          resolve(foundCourse);
      }
   });
}

updatestudent = function (studentData) {
  return new Promise(function (resolve, reject) {
      var foundStudent = null;
      var datarow=null;

      for (let i = 0; i < dataCollection.students.length; i++) {
          if (dataCollection.students[i].studentNum == studentData.studentNum) {
              foundStudent = dataCollection.students[i];
              datarow=i}}

              dataCollection.students[datarow].studentNum=studentData.studentNum,
              dataCollection.students[datarow].firstName=studentData.firstName,
              dataCollection.students[datarow].lastName=studentData.lastName,
              dataCollection.students[datarow].email=studentData.email,
              dataCollection.students[datarow].addressStreet=studentData.addressStreet,
              dataCollection.students[datarow].addressCity=studentData.addressCity,
              dataCollection.students[datarow].addressProvince=studentData.addressProvince;
              dataCollection.students[datarow].TA=studentData.TA;
              dataCollection.students[datarow].status=studentData.status
              dataCollection.students[datarow].course=studentData.course

      if (!foundStudent) {
          reject("this query returned didnt return any result"); return;
      }
      console.log(studentData)

      resolve(datarow);
  });
};

addstudent = function(studentData){
  return new Promise(function (resolve, reject) {
  studentData.TA = studentData.TA === undefined ? false : true;

  var studentNum = dataCollection.students.length + 1;
  studentData.studentNum = studentNum;

  dataCollection.students.push(studentData);

  resolve(dataCollection);
  });

}

module.exports = {initialize,getAllStudents, getTAs,getCourses,getStudentByNum, getStudentsByCourse,addstudent,updatestudent}

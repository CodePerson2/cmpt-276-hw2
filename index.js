const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:sammy5534@localhost/person'   //'postgres://postgres:sammy5534@localhost/users'  process.env.DATABASE_URL   
});

  var app = express()
  app.use(express.json())
  app.use(express.urlencoded({extended: false}))
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  app.get('/', (req, res) => res.render('pages/index'))
  app.get('/database', (req, res) => {
    var getUsersQuery = `SELECT * FROM person`;
    pool.query(getUsersQuery, (error, result) => {
      if(error)
        res.send(error);
      var results = {'rows': result.rows}
      res.render('pages/db', results);
    })
  });
  app.post('/node-server', (req, res) => {
    console.log("post username");
    var uname = req.body.uname;
    var fname = req.body.fname;

    res.send(`username: ${uname}, fname: ${fname}`);
  });

  app.post('/send/:person', (req, res) => {
    var person = req.params.person;
    var personArr = JSON.parse(person);
    var n = personArr;
    if(personArr[0] == 'insert'){
      var getUsersQuery = `INSERT INTO person(name, size, height, shape, color, pet, petName, petType) VALUES('` + n[1] + `', `  + n[2] + `, `  + n[3] + `, '` + n[4] + `', '` + n[5] + `', '` + n[6] + `', '` + n[7] + `', '` + n[8] + `') RETURNING id`;
    }
    else if(personArr[0] == 'delete'){
      var getUsersQuery = `delete from person where id = ` + personArr[1];
    }
    else if(personArr[0] == 'update'){
      var getUsersQuery = `update person set name = '` + n[1] + `', size = `+ n[2] + `, height = ` + n[3] + `, shape = '` + n[4] + `', color = '` + n[5] + `', pet = '` + n[6] + `', petName = '` + n[7] + `', petType = '` + n[8] + `' where id = ` + n[9];
    }
    pool.query(getUsersQuery, (error, result) => {
      if(error)
        res.send(error);
      
      var results = {'rows': result.rows}
      res.send(results);
    })
    // access database using uid
  });

  app.get('/users/:person', (req, res) => {
    //var person = req.params.person;
    //var personArr = JSON.parse(person);
    //console.log(personArr);
    var getUsersQuery = `SELECT * FROM person`;
    
    
    pool.query(getUsersQuery, (error, result) => {
      if(error)
        res.send(error);
      var results = {'rows': result.rows}
      res.send(results);
    })
    // access database using uid
  });


  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

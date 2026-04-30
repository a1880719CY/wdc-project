const express = require("express")
const {convertToCamelCase} = require("../utils/index")
const db = require("../db/index")
const router = express.Router()
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//login
router.post("/login", (req, res) => {
  let { username, password } = req.body
  console.log(username, password)
  if (!username || !password) {
      return res.cc('The username or password cannot be empty')
  }
  db.query('select * from user where username=?', username, (err, results) => {
      if (err) return res.cc(err)
      if (results.length === 0) return res.cc("The username or password you entered is incorrect!")
      if (results.length > 0) {
          if (password) {
              const user = { ...results[0], password: undefined, }
              const token = "Bearer " + req.jwt.sign(user, req.jwtKAY, { expiresIn: req.expiresIn })
              res.send({
                  status: 1,
                  code:200,
                  message: 'Login successful',
                  data:{
                      token,
                      ...convertToCamelCase(user),
                  },

                  
              })
          } else {
              res.cc('The username or password you entered is incorrect')
          }
      }
  })
})
//manager
router.post("/volunteerManagerLogin", (req, res) => {
  let { volunteerName, password } = req.body
  console.log(volunteerName, password)
  if (!volunteerName || !password) {
      return res.cc('The volunteerName or password cannot be empty')
  }
  db.query('select * from volunteer_manager where volunteer_name=?', volunteerName, (err, results) => {
      if (err) return res.cc(err)
      if (results.length === 0) return res.cc("The volunteerName or password you entered is incorrect!")
      if (results.length > 0) {
          if (password) {
              const user = { ...results[0], password: undefined, }
              const token = "Bearer " + req.jwt.sign(user, req.jwtKAY, { expiresIn: req.expiresIn })
              res.send({
                  status: 1,
                  code:200,
                  message: 'Login successful',
                  data:{
                      token,
                      ...convertToCamelCase(user),
                  },

                  
              })
          } else {
              res.cc('The volunteerName or password you entered is incorrect')
          }
      }
  })
})
//admin
router.post("/adminLogin", (req, res) => {
  let { name, password } = req.body
  console.log(name, password)
  if (!name || !password) {
      return res.cc('The name or password cannot be empty')
  }
  db.query('select * from admin where name=?', name, (err, results) => {
      if (err) return res.cc(err)
      if (results.length === 0) return res.cc("The name or password you entered is incorrect!")
      if (results.length > 0) {
          if (password) {
              const user = { ...results[0], password: undefined, }
              const token = "Bearer " + req.jwt.sign(user, req.jwtKAY, { expiresIn: req.expiresIn })
              res.send({
                  status: 1,
                  code:200,
                  message: 'Login successful',
                  data:{
                      token,
                      ...convertToCamelCase(user),
                  },

                  
              })
          } else {
              res.cc('The name or password you entered is incorrect')
          }
      }
  })
})
//addUser
router.post("/addUser", (req, res) => {
  let data = req.body
  data = [data]
  let sql = 'INSERT INTO user(username, full_name, password,email) VALUES ';
  for (let i = 0; i < data.length; i++) {
      sql += `('${data[i].username}', '${data[i].fullName}', '${data[i].password}', '${data[i].email}')`;
      if (i !== data.length - 1) {
          sql += ', ';
      }
  }
  db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows != 1) return res.cc('Add failed, please try again later！')
      if (results.affectedRows === 1) {
          res.send({
              status: 1,
              message: 'Successfully added!',
              code: 200,

          })
      }
  })
})
//addVolunteerManager
router.post("/addVolunteerManager", (req, res) => {
  let data = req.body
  data = [data]
  let sql = 'INSERT INTO volunteer_manager(volunteer_name, full_name, password,email) VALUES ';
  for (let i = 0; i < data.length; i++) {
      sql += `('${data[i].volunteerName}', '${data[i].fullName}', '${data[i].password}','${data[i].email}')`;
      if (i !== data.length - 1) {
          sql += ', ';
      }
  }
  db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows != 1) return res.cc('Add failed, please try again later！')
      if (results.affectedRows === 1) {
          res.send({
              status: 1,
              message: 'Successfully added!',
              code: 200,

          })
      }
  })
})


//getVolunteerOrg
router.get("/getActivityList", (req, res) => {
    // let {  volunteerManagerId, isPublic,title } = req.query;
    let sql = 'SELECT * FROM activity WHERE 1=1';
    let isPublic=1
    if (isPublic) {
      sql += ` AND is_public = '${isPublic}'`;
    }
    // if (volunteerManagerId) {
    //   sql += ` AND volunteer_manager_id = '${volunteerManagerId}'`;
    // }
    // if (title) {
    //   sql += ` AND title LIKE '%${title}%'`;
    // }
    db.query(sql, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 1,
        message: 'Query successful!',
        data: convertToCamelCase(results),
        code: 200,
      });
    });
  });
module.exports = router;

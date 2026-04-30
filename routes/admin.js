var express = require('express');
const {convertToCamelCase} = require("../utils/index")
var router = express.Router();
const db = require('../db/index');
  //getUser
  router.get("/getUser", (req, res) => {
    let {id, username, fullName, password, email } = req.query;
    let sql = 'SELECT * FROM user WHERE 1=1';
    if (id) {
      sql += ` AND id = '${id}'`;
    }
    if (username) {
      sql += ` AND username = '${username}'`;
    }
    if (fullName) {
      sql += ` AND full_name = '${fullName}'`;
    }
    if (password) {
      sql += ` AND password LIKE '%${password}%'`;
    }
    if (email) {
      sql += ` AND create_date = '${email}'`;
    }
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
  //getVolunteerManager
  router.get("/getVolunteerManager", (req, res) => {
    let {id, volunteerName, fullName, password } = req.query;
    let sql = 'SELECT * FROM volunteer_manager WHERE 1=1';
    if (id) {
      sql += ` AND id = '${id}'`;
    }
    if (volunteerName) {
      sql += ` AND volunteer_name = '${volunteerName}'`;
    }
    if (fullName) {
      sql += ` AND full_name = '${fullName}'`;
    }
    if (password) {
      sql += ` AND password LIKE '%${password}%'`;
    }
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
  //getAdmin
  router.get("/getAdmin", (req, res) => {
    let { name, fullName, password } = req.query;
    let sql = 'SELECT * FROM volunteer_org WHERE 1=1';
    if (name) {
      sql += ` AND volunteer_name = '${name}'`;
    }
    if (fullName) {
      sql += ` AND full_name = '${fullName}'`;
    }
    if (password) {
      sql += ` AND password LIKE '%${password}%'`;
    }
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

  
  //addAdmin
  router.post("/addAdmin", (req, res) => {
    let data = req.body
    data = [data]
    let sql = 'INSERT INTO admin(name, full_name, password) VALUES ';
    for (let i = 0; i < data.length; i++) {
        sql += `('${data[i].name}', '${data[i].fullName}', '${data[i].password}')`;
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


  //updateUser
  router.put("/updateUser", (req, res) => {
    let { id, username, fullName, password,email} = req.body;
    let sql = 'UPDATE user SET ';
    let updates = [];
  
    if (username) {
      updates.push(`username = '${username}'`);
    }
    if (fullName) {
      updates.push(`full_name = '${fullName}'`);
    }
    if (password) {
      updates.push(`password = '${password}'`);
    }
    if (email) {
      updates.push(`email = '${email}'`);
    }
    sql += updates.join(', ');
    sql += ` WHERE id = ${id}`;
  
    db.query(sql, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows === 0) {
        return res.cc('Update failed, please try again later!');
      }
      res.send({
        status: 1,
        message: 'Update successful!',
        code: 200,
      });
    });
  });
  //updateVolunteerManager
  router.put("/updateVolunteerManager", (req, res) => {
      let { id, volunteerName, fullName, password} = req.body;
      let sql = 'UPDATE volunteer_manager SET ';
      let updates = [];
      if (volunteerName) {
        updates.push(`volunteer_name = '${volunteerName}'`);
      }
      if (fullName) {
        updates.push(`full_name = '${fullName}'`);
      }
      if (password) {
        updates.push(`password = '${password}'`);
      }
      if (email) {
        updates.push(`email = '${email}'`);
      }
      
      sql += updates.join(', ');
      sql += ` WHERE id = ${id}`;
    
      db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows === 0) {
          return res.cc('Update failed, please try again later!');
        }
        res.send({
          status: 1,
          message: 'Update successful!',
          code: 200,
        });
      });
  });
  //updateAdmin
  router.put("/updateAdmin", (req, res) => {
      let { id, name, fullName, password} = req.body;
      let sql = 'UPDATE admin SET ';
      let updates = [];
      if (name) {
        updates.push(`name = '${name}'`);
      }
      if (fullName) {
        updates.push(`full_name = '${fullName}'`);
      }
      if (password) {
        updates.push(`password = '${password}'`);
      }
      sql += updates.join(', ');
      sql += ` WHERE id = ${id}`;
      console.log(sql)
      db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows === 0) {
          return res.cc('Update failed, please try again later!');
        }
        res.send({
          status: 1,
          message: 'Update successful!',
          code: 200,
        });
      });
  });
  //deleteUser
  router.delete("/deleteUser/:id", (req, res) => {
    const userId = req.params.id;
  
    let sql = `DELETE FROM user WHERE id = ?`;
  
    db.query(sql, [userId], (err, results) => {
      if (err) return res.cc(err);
  
      if (results.affectedRows === 0) {
        return res.cc('Delete failed, please try again later!');
      }
  
      res.send({
        status: 1,
        message: 'Delete successful!',
        code: 200
      });
    });
  });
  
  //deleteVolunteerManager
  router.delete("/deleteVolunteerManager/:id", (req, res) => {
    const managerId = req.params.id;
    let sql = `DELETE FROM volunteer_manager WHERE id = ?`;
  
    db.query(sql, [managerId], (err, results) => {
      if (err) return res.cc(err);
  
      if (results.affectedRows === 0) {
        return res.cc('Delete failed, please try again later!');
      }
      res.send({
        status: 1,
        message: 'Delete successful!',
        code: 200
      });
    });
  });
  //deleteAdmin
  router.delete("/deleteAdmin/:id", (req, res) => {
    const adminId = req.params.id;
    let sql = `DELETE FROM admin WHERE id = ?`;
    db.query(sql, [adminId], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows === 0) {
        return res.cc('Delete failed, please try again later!');
      }
      res.send({
        status: 1,
        message: 'Delete successful!',
        code: 200
      });
    });
  });
  module.exports = router;

var express = require('express');
const {convertToCamelCase} = require("../utils/index")
var router = express.Router();
const db = require('../db/index');
   //addActivity
router.post("/addActivity", (req, res) => {
    let data = req.body;
    let user = req.user; // token get userInfo
    data = [data];
    let sql =
      "INSERT INTO activity(content, volunteer_manager_id,create_date,is_public,background,title) VALUES ";

    for (let i = 0; i < data.length; i++) {
      sql += `('${data[i].content}', '${data[i].volunteerManagerId}','${data[i].createDate}','${data[i].isPublic}','${data[i].background}','${data[i].title}' )`;
      if (i !== data.length - 1) {
        sql += ", ";
      }
    }
    db.query(sql, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows != 1)
        return res.cc("Add failed, please try again later！");
      if (results.affectedRows === 1) {
        let sql1 = `SELECT u.* 
      FROM volunteer_manager u
      JOIN volunteer_users vu ON u.id = vu.user_id  
      WHERE vu.volunteer_org_id = ?`;

        db.query(sql1, [user.id], (err, results1) => {
          let users = results1;
          const currentDate = new Date();
          const formattedDate = currentDate
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          if (err) return res.cc(err);
          let sql =
            "INSERT INTO reply(user_id, is_RVSP,activty_id,create_date) VALUES ";
          for (let i = 0; i < users.length; i++) {
            sql += `('${users[i].id}', '${3}','${
              results.insertId
            }','${formattedDate}')`;
            if (i !== users.length - 1) {
              sql += ", ";
            }
          }

          db.query(sql, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows == 0)
              return res.cc("Add failed, please try again later！");
            if (results.affectedRows !== 0) {
              res.send({
                status: 1,
                message: "Successfully added!",
                code: 200,
              });
            }
          });
        });
      }
    });
  });
//getMember
router.get("/getMember", async (req, res) => {
  let user = req.user; // token get userInfo
  try {
    let sql = `SELECT u.* 
    FROM volunteer_manager u
    JOIN volunteer_users vu ON u.id = vu.user_id  
    WHERE vu.volunteer_org_id = ?`;

    db.query(sql, [user.id], (err, results) => {
    if (err) return res.cc(err);
    res.send({
    status: 1,
    message: 'Query successful!',
    data: results,
    code: 200,
    });
  });
  } catch (err) {
    return res.cc(err);
  }
});
//getVolunteerOrg
router.get("/getVolunteerOrg", (req, res) => {
  let { name, volunteerManagerId, introduce, createDate } = req.query;
  let sql = 'SELECT * FROM volunteer_org WHERE 1=1';
  if (name) {
    sql += ` AND name = '${name}'`;
  }
  if (volunteerManagerId) {
    sql += ` AND volunteer_manager_id = '${volunteerManagerId}'`;
  }
  if (introduce) {
    sql += ` AND introduce LIKE '%${introduce}%'`;
  }
  if (createDate) {
    sql += ` AND create_date = '${createDate}'`;
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
//updateActivity
router.put("/updateActivity", (req, res) => {
  let { id, content, volunteerManagerId, isPublic,background,title } = req.body;

  let sql = 'UPDATE activity SET ';
  let updates = [];

  if (content) {
    updates.push(`content = '${content}'`);
  }
  if (volunteerManagerId) {
    updates.push(`volunteer_manager_id = '${volunteerManagerId}'`);
  }
  if (isPublic) {
    updates.push(`is_public = '${isPublic}'`);
  }
  if (background) {
    updates.push(`background = '${background}'`);
  }
  if (title) {
    updates.push(`title = '${title}'`);
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
//getMember
router.get("/getUserRVSP", async (req, res) => {
  let {id} = req.query; // token get userInfo
  try {
    let sql = `SELECT u.username, u.full_name,r.is_RVSP as isRVSP ,r.create_date
    FROM user u
    JOIN reply r ON u.id = r.user_id  
    JOIN activity ac ON r.activty_id = ac.id  
    WHERE ac.id = ?`;

    db.query(sql, [id], (err, results) => {
    if (err) return res.cc(err);
    res.send({
    status: 1,
    message: 'Query successful!',
    data: convertToCamelCase(results),
    code: 200,
    });
  });
  } catch (err) {
    return res.cc(err);
  }
});
module.exports = router;

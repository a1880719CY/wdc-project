var express = require('express');
var router = express.Router();
const {convertToCamelCase,getFormattedDate} = require("../utils/index")
const db = require('../db/index');
//addVolunteerOrg
router.post("/addVolunteerOrg", (req, res) => {
  let data = req.body
  data = [data]
  let sql = 'INSERT INTO volunteer_org(name, volunteer_manager_id, introduce,create_date) VALUES ';
  for (let i = 0; i < data.length; i++) {
      sql += `('${data[i].name}', '${data[i].volunteerManagerId}', '${data[i].introduce}', '${getFormattedDate()}')`;
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
router.get("/getVolunteerOrg", (req, res) => {
  let {id, name, volunteerManagerId, introduce, createDate } = req.query;
  let sql = 'SELECT * FROM volunteer_org WHERE 1=1';
  if (id) {
    sql += ` AND id = '${id}'`;
  }
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
//updateVolunteerOrg
router.put("/updateVolunteerOrg", (req, res) => {
  let { id, name, volunteerManagerId, introduce, createDate } = req.body;

  let sql = 'UPDATE volunteer_org SET ';
  let updates = [];

  if (name) {
    updates.push(`name = '${name}'`);
  }
  if (volunteerManagerId) {
    updates.push(`volunteer_manager_id = '${volunteerManagerId}'`);
  }
  if (introduce) {
    updates.push(`introduce = '${introduce}'`);
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
//deleteVolunteerOrg
 router.delete("/deleteVolunteerOrg", async (req, res) => {
  const { ids } = req.query;
  data = ids.split(",");
  let sql = "DELETE FROM org WHERE id IN (";
  for (let i = 0; i < data.length; i++) {
    sql += data[i];
    if (i !== data.length - 1) {
      sql += ", ";
    }
  }
  sql += ")";
  try {
    db.query(sql, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== data.length) {
        return res.cc("Delete failed, please try again later!");
      }
      res.send({
        status: 1,
        message: "Deleted successfully!",
        code: 200,
      });
    });
  } catch (err) {
    return res.cc(err);
  }
});
//getVolunteerUserOrg
router.get("/getVolunteerUserOrg", async (req, res) => {
  let user = req.user; // token get userInfo
  try {
    let sql = `SELECT vo.* 
    FROM volunteer_users vu 
    JOIN volunteer_org vo ON vu.volunteer_org_id = vo.id
    WHERE vu.user_id = ?`;

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
//joinVolunteerOrg
router.post("/joinVolunteerOrg", async (req, res) => {
  let data = req.body;
  let user = req.user;
  if(!user.username){
    res.cc('Only regular users can join the organization！');
  }
  data = [data];
  let sql = 'INSERT INTO volunteer_users(volunteer_org_id, user_id,create_date) VALUES ';
  let promises = [];

  for (let i = 0; i < data.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        db.query(`SELECT id FROM volunteer_users WHERE user_id= ${user.id} and volunteer_org_id=${data[i].volunteerOrgId}`, (err, results) => {
          if (err) {
            reject(err);
          } else if (results.length !== 0) {
            reject('You have joined the organization, please do not join again！');
          } else {
            sql += `(${data[i].volunteerOrgId}, ${user.id}, '${getFormattedDate()}')`;
            if (i !== data.length - 1) {
              sql += ', ';
            }
            resolve();
          }
        });
      })
    );
  }
  try {
    await Promise.all(promises);
    db.query(sql, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== data.length) {
        return res.cc('Join failed, please try again later！');
      }
      res.send({
        status: 1,
        message: 'Joined successfully, welcome you~',
        code: 200,
      });
    });
  } catch (err) {
    return res.cc(err);
  }
});
//quitVolunteerOrg
router.delete("/quitVolunteerOrg", async (req, res) => {
  const { userId, volunteerOrgId } = req.query;

  let sql = 'DELETE FROM volunteer_users WHERE user_id = ? AND volunteer_org_id = ?';

  try {
    db.query(sql, [userId, volunteerOrgId], (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows === 0) {
        return res.cc('Delete failed, please try again later!');
      }
      res.send({
        status: 1,
        message: 'Deleted successfully!',
        code: 200,
      });
    });
  } catch (err) {
    return res.cc(err);
  }
});

module.exports = router;

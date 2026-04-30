var express = require('express');
var router = express.Router();
const db = require('../db/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var numVisit = 0;
router.get('/color.html', function(req, res, next) {
  var pageColor = "";
  var sceneNum = numVisit%4;
  switch (sceneNum) {
    case 0:
      pageColor = "red";
      break;

    case 1:
      pageColor = "yellow";
      break;

    case 2:
      pageColor = "green";
      break;

    case 3:
      pageColor = "blue";
      break;

  }
  numVisit++;
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <link rel="stylesheet" href="/stylesheets/style.css">
  </head>
  <body>
      <h1 style="color:${pageColor};">${pageColor}</h1>
  </body>
  </html>
  `);

});

//updateReply  user RVSP
router.put("/updateReply", (req, res) => {
  let { userId,isRVSP,activtyId} = req.body;

  let sql = 'UPDATE reply SET ';
  let updates = [];
  if (userId) {
    updates.push(`user_id = '${userId}'`);
  }
  if (isRVSP) {
    updates.push(`is_RVSP = '${isRVSP}'`);
  }
 
  sql += updates.join(', ');
  sql += ` WHERE user_id = ${userId} and activty_id =${activtyId}`;
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

module.exports = router;

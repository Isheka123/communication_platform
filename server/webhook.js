const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Import MySQL module

const app = express();
const PORT = 8001;

app.use(bodyParser.json());

// MySQL database connection configuration
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "userdata",
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/webhook', (req, res) => {
  const postData = req.body;

  console.log('Webhook Payload:', postData);
  const receivedDate = new Date(postData.Date).toISOString().slice(0, 19).replace('T', ' ');

  // MySQL query to insert data into a table
  const sql = `INSERT INTO received (FromName,  ToEmail, Subject, Body, \`Date\`) 
             VALUES (?, ?, ?, ?, ?)`;

  
  const values = [
    postData.From,
    postData.ToFull[0].Email,
    postData.Subject,
    postData.TextBody,
    receivedDate 
  ];

  // Execute the query
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).send('Error inserting data into MySQL');
      return;
    }
    console.log('Data inserted into MySQL');
    res.status(200).send('Webhook received successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

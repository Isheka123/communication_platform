require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./passport"); // Require your passport configuration file
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const postmark = require("postmark");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "userdata",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "communication",
    keys: ["communication"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/create-sender-signature", async (req, res) => {
  try {
    const { FromEmail, Name } = req.body;
    
    if (!FromEmail || !Name) {
      return res.status(400).json({ error: "Email and Name are required" });
    }

    const url = "https://api.postmarkapp.com/senders";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_TOKEN,
    };

    const data = {
      FromEmail: FromEmail,
      Name: Name,
    };

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      console.log("Sender Signature created successfully:", response.data);
      return res.status(200).json({
        message: "Sender Signature created successfully",
        data: response.data,
      });
    }
  } catch (error) {
    if (
      error.response &&
      error.response.status === 422 &&
      error.response.data &&
      error.response.data.ErrorCode === 504 &&
      error.response.data.Message === "This signature already exists."
    ) {
      return res
        .status(200)
        .json({ message: "This signature already exists." });
    }
    console.error("Error creating Sender Signature:", error.message);
    res.status(500).json({
      error: "Failed to create Sender Signature",
      message: error.message,
    });
  }
});

const API_URL = "https://api.postmarkapp.com/senders";
const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

app.get("/get-sender-signatures", async (req, res) => {
  try {
    const count = req.query.count || 10; // Number of records to return per request
    const offset = req.query.offset || 0; // Number of records to skip

    const url = `${API_URL}?count=${count}&offset=${offset}`;

    const headers = {
      Accept: "application/json",
      "X-Postmark-Account-Token": POSTMARK_TOKEN,
    };

    const response = await axios.get(url, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching sender signatures:", error.message);
    res.status(500).json({ error: "Error fetching sender signatures" });
  }
});

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.post("/send-email", async (req, res) => {
  const { to, subject, htmlBody, send } = req.body;

  try {
    const response = await client.sendEmail({
      From: send,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: "Hello from Postmark!",
      MessageStream: "broadcast",
    });
    const date = new Date(response.SubmittedAt);
    const options = {
      timeZone: "Asia/Kolkata", // India Standard Time (IST)
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const istDate = date.toLocaleString("en-US", options);
    console.log(istDate);
    const date1 = new Date(istDate);

    
    const mysqlFormattedDate = date1
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    console.log(mysqlFormattedDate);
    const emailData = {
      sent: send,
      subject: subject,
      sentbody: htmlBody,
      received: to,
      time: mysqlFormattedDate,
    };
    const insertQuery = "INSERT INTO customer SET ?";

    connection.query(insertQuery, emailData, async (error, results, fields) => {
      if (error) {
        console.error("Error inserting email data into MySQL:", error);
        res.status(500).json({ error: "Failed to send email" });
        return;
      }

      if (response.ErrorCode === 0) {
        res.status(200).json({ message: "Email sent successfully" });
        console.log("Additional logs after sending email");
        console.log("Server-side status code:", res.statusCode);
      } else {
        res.status(500).json({ error: "Failed to send email" });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/emails", async (req, res) => {
  try {
    const query = "SELECT * FROM customer";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      res.status(200).json(results); 
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/receivedEmails", async (req, res) => {
  try {
    const query = "SELECT * FROM received"; 
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching received emails:", error);
        res.status(500).json({ error: "Error fetching received emails" });
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error fetching received emails:", error);
    res.status(500).json({ error: "Error fetching received emails" });
  }
});




app.use("/auth", authRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

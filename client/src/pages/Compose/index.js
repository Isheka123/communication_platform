import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
// import { Link } from "react-router-dom";

const ComposeEmail = (userDetails) => {
  const user = userDetails.user;
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const send = user.email;
  const navigate = useNavigate();
  const handleSendEmail = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, htmlBody, send }),
    });
    const data = await response.json();
    console.log(data);

    if (data.status === 401 || !data) {
      console.log("error");
    } else {
      console.log("Email sent");
      setHtmlBody("");
      setSubject("");
      setTo("");
      navigate("/send");
    }
  };

  return (
    <div className="bot">
      <h1>Compose Email</h1>
      <form>
        <label>
          From:
          <input type="email" value={send} placeholder="Enter your email" />
        </label>

        <label>
          To:
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter recipient's email"
          />
        </label>

        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
          />
        </label>

        <label>
          Body:
          <textarea
            value={htmlBody}
            onChange={(e) => setHtmlBody(e.target.value)}
            placeholder="Enter in body"
          />
        </label>
          <button type="button" className="button" onClick={handleSendEmail}>
            Send Email
          </button>
      </form>
    </div>
  );
};

export default ComposeEmail;

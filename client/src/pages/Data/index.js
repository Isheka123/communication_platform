import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './style.css';

const ComposeButton = (userDetails) => {
  const user = userDetails.user;
  const email = user.email;
  const [data, setData] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [showReceived, setShowReceived] = useState(false); 
  const [receivedData, setReceivedData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchReceivedEmails();
  }); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/emails");
      setData(response.data.filter(item => item.sent === email)); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchReceivedEmails = async () => {
    try {
      const response = await axios.get("http://localhost:8000/receivedEmails"); 
      setReceivedData(response.data.filter(item => item.ToEmail === email)); 
    } catch (error) {
      console.error("Error fetching received emails:", error);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory); 
    setShowReceived(false); 
  };

  const toggleReceived = () => {
    setShowReceived(!showReceived); 
    setShowHistory(false); 
  };

  return (
    <>
      <Link to="/compose">
        <button className="custom-button">Compose</button>
      </Link>
      <button className="custom-button" onClick={toggleHistory}>Communication History</button> 
      <button className="custom-button" onClick={toggleReceived}>Received Emails</button> 
      {showHistory && (
        <div>
          <h2 className="h2">Communication History</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Sent Email</th>
                <th>Subject</th>
                <th>Sent Body</th>
                <th>Received</th>
                <th>Submitted time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.sent}</td>
                  <td>{item.subject}</td>
                  <td>{item.sentbody}</td>
                  <td>{item.received}</td>
                  <td>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      {showReceived && (
        <div>
          <h2 className="h2">Communication History</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Received Email</th>
                <th>Subject</th>
                <th>Received Body</th>
                <th>Sender</th>
                <th>Received time</th>
              </tr>
            </thead>
            <tbody>
              {receivedData.map((item) => (
            <tr key={item.id}>
              <td>{item.ToEmail}</td>
              <td>{item.Subject}</td>
              <td>{item.Body}</td>
              <td>{item.FromName}</td>
              <td>{item.Date}</td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ComposeButton;
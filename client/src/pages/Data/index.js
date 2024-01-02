import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './style.css';

const ComposeButton = (userDetails) => {
  const user = userDetails.user;
  const email = user.email;
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/emails");
      setData(response.data.filter(item => item.sent === email)); // Filter data by the 'sent' email
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
    <Link to="/compose">
      <button className="custom-button">Compose</button>
    </Link>
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
</>
  );
};

export default ComposeButton;

import React, { useState } from "react";
import axios from "axios";
import Confirmation from "../Confirmation";
import { useNavigate } from "react-router-dom";
import './styles.css'; 

const CreateSenderSignaturePage = (userDetails) => {
  const user = userDetails.user;
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const navigate = useNavigate();
  
    const handleCreateSignature = async () => {
      try {
        const data = {
          FromEmail: user.email,
          Name: user.name,
        };
  
        const response = await axios.post("http://localhost:8000/create-sender-signature", data);
        // console.log(response.data);
  
        if (response.status === 200) {
          // Signature created successfully
          // console.log("Sender Signature created successfully:", response.data.message);
          setConfirmationMessage(response.data.message);
          setShowConfirmation(true);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
  
          if (status === 201 && data.error === "Sender Signature already exists") {
            setErrorMessage("Sender Signature already exists");
          } else if (status === 500) {
            setErrorMessage(error.message); 
          } else {
            setErrorMessage("Error creating sender signature");
          }
        } else {
          setErrorMessage("Error creating sender signature");
        }
      }
    };
   
    const handleDone = async () => {
      try {
          const response = await axios.get("http://localhost:8000/get-sender-signatures");
  
          // Check if the email matches in any of the SenderSignatures with Confirmed as true
          const senderSignatures = response.data.SenderSignatures || [];
          const validSignature = senderSignatures.find(signature => {
              return signature.EmailAddress === user.email && signature.Confirmed;
          });
  
          if (validSignature) {
              setShowConfirmation(false);
              setConfirmationMessage("");
              navigate("/send");
          } else {
              // If the email does not match or Confirmed is false, show an error message or handle it accordingly
              setErrorMessage("Please Check your email and confirm the sender signature");
              setShowConfirmation(false);
          }
      } catch (error) {
          console.error("Error fetching sender signatures:", error.message);
          setErrorMessage("Error fetching sender signatures");
      }
  };
  
  
    return (
      <div className="container1">
        <h1>Create Sender Signature Page</h1>
        <div className="box">
          <label>Email:</label>
          <input type="email" value={user.email}  />
        </div>
        <div className="box">
          <label>Name:</label>
          <input type="text" value={user.name} />
        </div>
        <button onClick={handleCreateSignature}>Create Signature</button>
        {errorMessage && <p>{errorMessage}</p>}
       
        {showConfirmation && (
        <Confirmation
          message={confirmationMessage}
          onDone={handleDone}
        />
      )}
      </div>
    );
  };
  
  export default CreateSenderSignaturePage;
  
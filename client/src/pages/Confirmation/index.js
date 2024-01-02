import React from "react";
import "./style.css";

const ConfirmationPage = ({ message, onDone }) => {
  let displayMessage = message;

  if (message === "This signature already exists." || message === "Sender Signature created successfully") {
    displayMessage = `${message} Click on 'Done' to continue.`;
  }

  return (
    <div>
      <h1>Confirmation Page</h1>
      <h2 style={{ textAlign: "center" }}>{displayMessage}</h2>
      <button onClick={onDone}>Done</button>
    </div>
  );
};

export default ConfirmationPage;

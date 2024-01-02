import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import CreateSender from "./pages/CreateSender";
import Compose from "./pages/Compose";
import Data from "./pages/Data";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const logout = () => {
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
	};
  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container">
     <button onClick={logout}>Log Out</button>
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <CreateSender user={user} /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/compose"
          element={user ? <Compose user={user} /> : <Navigate to="/" />}
        />
        <Route
          exact
          path="/send"
          element={user ? <Data user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;

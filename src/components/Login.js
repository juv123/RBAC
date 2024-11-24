import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    // Retrieve and parse user data from localStorage
    let storedUsers;
    try {
      storedUsers = JSON.parse(localStorage.getItem("users"));
    } catch (error) {
      toast.error("Error reading user data. Please try again.");
      return;
    }

    if (storedUsers && Array.isArray(storedUsers)) {
      // Find user in the array
      const user = storedUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
       
        if(user.role=='admin'){
          toast.success(`${username} has logged in successfully!`);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 3000); // 3-second delay to allow the toast to display
      } else if(user.role=='user' || user.role=='guest') {
        toast.error("Only Admins can acess Admin Dashboard");
      }
      else{
      }
    
    } else {
      toast.error("No user data found. Please register first.");
    }
  }
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form
        onSubmit={handleLogin}
        className="absolute p-8 w-full md:w-4/12 bg-black my-36 mx-auto right-0 left-0 top-0 text-white bg-opacity-80"
      >
        <h1 className="font-bold text-lg md:text-3xl">Login</h1>
        <input
          type="text"
          placeholder="User Name"
          className="w-full bg-slate-600 p-1 m-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-slate-600 p-1 m-1"
          autoComplete="true"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 rounded w-full m-1">
          Login
        </button>
        <button
          type="button"
          className="bg-blue-600 rounded w-full m-1"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
      <ToastContainer position="top-right"  />
    </div>
  );
};

export default Login;

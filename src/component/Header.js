import React from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css'; 

const Header = () => {
    const useremail= localStorage.getItem("email")
    const navigate = useNavigate();

   const logout = () => {
    localStorage.removeItem("email")
    localStorage.removeItem("isloggedin")
    navigate("/")
   }

  return (
    <header>
      <h1>{useremail}</h1>
      <button onClick={logout}>Log out</button>
    </header>
  );
}

export default Header;

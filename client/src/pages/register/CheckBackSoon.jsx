import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { SearchResultsList } from "../../components/searchBar/SearchResultsList";



const CheckBackSoon = () => {


  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Thank you for your submission!</h1>
          <p>
            Check back soon and login with your admin credentials if your univerity is approved.
          </p>
          
          <Link to="/login">
            <button>Login</button>
          </Link>

          </div>
          
        
      </div>
      

    </div>
  );
};

export default CheckBackSoon;

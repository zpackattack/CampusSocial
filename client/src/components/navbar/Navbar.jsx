import "./navbar.scss";
import React, { useState, useEffect } from 'react';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from '../../axios';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  

  const { isLoading, error, data } = useQuery(["university"], () =>
    makeRequest.get("/university/id/" + currentUser.universityID).then((res) => {
      console.log("nav Uni", res.data);
      return res.data[0];
    })
  );



  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none", color: "#5271ff" }}>
          <span>Campus Social</span>
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} style={{zIndex:99}}/>
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} style={{zIndex:99}}/>
        )}
        {/*<GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
      </div>*/}
      
      </div>

      <div className="center" style={{marginLeft: "-30%", width: "45%"}}>
      {data?.logo ? (
              <>
                <img src={data.logo} alt="" style={{paddingLeft: "50%", zIndex: 1}}/>
                
              </>
              ):(
              <>
                <img src="https://cdn2.iconfinder.com/data/icons/maki/100/college-512.png" alt="" />
              </>
            )}
    {data?.name && (
      <span>{data.name}</span>
    )}
      </div>

      <div className="right">
        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <PersonOutlinedIcon />
          
        </Link>
        <span>Hello, {currentUser.name}</span>
        <div className="user">
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;

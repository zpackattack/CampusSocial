import "./leftBar.scss";
import React, { useState, useEffect } from 'react';
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { makeRequest } from '../../axios';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);
  const [rsoCount, setRSOCount] = useState(0);
  const [rsoRequestCount, setRSORequestCount] = useState(0);
  const { isLoading, error, data } = useQuery(["university"], () =>
    makeRequest.get("/university/id/" + currentUser.universityID).then((res) => {
      console.log("uni", res.data);
      return res.data[0];
    })
  );

  const fetchUserRSOCount = async () => {
    try {
      const response = await makeRequest.get('/rso/userRSOCount/'+ currentUser.userID);
      console.log(currentUser.userID);
      console.log("RSO ", response.data[0].adminRSOCount);
      setRSOCount(response.data[0].adminRSOCount);

    } catch (error) {
      console.error('Error fetching rsoCount requests:', error);
    }
  };

  const fetchUserRSORequestCount = async () => {
    try {
      const response = await makeRequest.get('/rso/userRSORequestCount/'+ currentUser.userID);
      
      setRSORequestCount(response.data[0].userRSORequestCount);

    } catch (error) {
      console.error('Error fetching rsoRequestCount requests:', error);
    }
  };

  useEffect(() => {
    fetchUserRSOCount();
    fetchUserRSORequestCount();
  }, []);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="user">
            <PersonOutlinedIcon />
            <span>{currentUser.name}</span>
          </div>
          </Link>
          <Link to={`/university/${currentUser.universityID}`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            {data?.logo ? (
              <>
                <img src={data.logo} alt="" />
                <span>University</span>
              </>
              ):(
              <>
                <img src="https://cdn2.iconfinder.com/data/icons/maki/100/college-512.png" alt="" />
                <span>University</span>
              </>
            )}
          </div>
          </Link>
          <Link to={`/userRSOs`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://images.squarespace-cdn.com/content/v1/5ac285c04eddecf58e185097/df3a8c42-b330-4add-a000-b02c93660b8b/ccc-leaders.png" alt="" />
            <span>Joined RSOs</span>
          </div>
          </Link>
          <Link to={`/allRSOs`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://images.squarespace-cdn.com/content/v1/5ac285c04eddecf58e185097/bd93d448-38e5-4406-ad9f-6e319e554f43/ccc-magnifying.png" alt="" />
            <span>Explore RSOs</span>
          </div>
          </Link>
          
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <Link to={`/createRSO`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" alt="" />
            <span>Create RSO</span>
          </div>
          </Link>
          {rsoRequestCount >= 1 ? (
          <Link to={`/yourRSORequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://cdn-icons-png.freepik.com/256/12901/12901779.png" alt="" />
            <span>Your RSO Requests</span>
          </div>
          </Link>
          ):(<></>)}
          {currentUser.userType >= 1 && rsoCount >=1 ? (
          <Link to={`/yourAdminRSOs`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://www.intertek.com/siteassets/about-us/5_44500-people_icon_RGB.png" alt="" />
            <span>Your RSOs</span>
          </div>
          </Link>
          ):(<></>)}
          {currentUser.userType >= 2 ? (
          <Link to={`/EventPortal`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://cdn.iconscout.com/icon/free/png-256/free-event-processing-calendar-appointment-planner-schedule-reminder-6-5604.png" alt="" />
            <span>Event Portal</span>
          </div>
          </Link>
        ):(<></>)}
          {currentUser.userType >= 2 ? (
          <Link to={`/RSORequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://www.jp.pima.gov/Images/Records%20Request%20Icon.png" alt="" />
            <span>RSO Request Portal</span>
          </div>
          </Link>
          ):(<></>)}
          {currentUser.userType >= 4 ? (
          <Link to={`/UniversityRequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src="https://www.jp.pima.gov/Images/Small%20Claims%20Icon.png" alt="" />
            <span>University Request Portal</span>
          </div>
          </Link>
          ):(<></>)}
        </div>
        
      </div>
    </div>
  );
};

export default LeftBar;

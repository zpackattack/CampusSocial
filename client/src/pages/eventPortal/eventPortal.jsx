import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import './eventPortal.scss';

const EventPortal = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);



  const fetchEventRequests = async () => {
    try {
      const response = await makeRequest.get('/event/getApprovalEvents/0');
      setRequests(response.data);
      
    } catch (error) {
      console.error('Error fetching Event requests:', error);
    }
  };


  
  useEffect(() => {
    fetchEventRequests();
  }, []);

  
  const handleApprove = async (request) => {
    const body = {
      eventID: request.eventID,
      status: 2
    };

    try {
      
      await makeRequest.put(`/event/setStatus`, body);
      


    fetchEventRequests();
    } catch (error) {
      console.error('Error approving Event request:', error);
    }
  };

  // Function to handle denial of RSO request
  const handleDeny = async (request) => {
    const body = {
      eventID: request.eventID,
      status: 1
    };

    try {
      await makeRequest.put(`/event/setStatus`, body);

      fetchEventRequests();
    } catch (error) {
      console.error('Error denying event request:', error);
    }
  };

  return (
    <div className="eventPortal">
      <h1>Public Event Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Description</th>
            <th>Date/Time</th>
            <th>Location</th>
            <th>Contact Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.eventID}>
              <td>{request.name}</td>
              <td>{request.descriptions}</td>
              <td>{`${moment(request.date).format("MMMM DD, YYYY")} (${moment(request.time, "HH:mm:ss").format("hh:mm A")})`}</td>
              <td>{request.locationID}</td>
              <td>{`${request.contactPhone} (${request.contactEmail})`}</td>
              
              <td>
                <button  className="approve" onClick={() => handleApprove(request)}>Approve</button>
                <button  className="deny" onClick={() => handleDeny(request)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventPortal;

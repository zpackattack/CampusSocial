import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './eventPortal.scss';

const EventPortal = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [memberEmails, setMemberEmails] = useState({});


  const fetchEventRequests = async () => {
    try {
      const response = await makeRequest.get('/event/getApprovalEvents/2');
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
      requestID: request.requestID,
      status: 2
    };

    const rsoBody = {
      name: request.rsoName,
      adminID: request.userID,
      universityID: request.universityID,
      profilePicture: null,
      rsoPicture: null
    };
    const premotion = {
      userID: request.userID,
      userType: 1
    }
    console.log(rsoBody);

    try {
      const rsoResponse = await makeRequest.post(`/rso/`, rsoBody);
      const rsoID = rsoResponse.data.rsoID;
      await makeRequest.put(`/rso/setRSO`, body);
      await makeRequest.put(`/users/premote`, premotion);

      for (const member of memberEmails[request.requestID]) {
        const userID = member.userID;

        const memberBody = {
            userID,
            rsoID
        };
        
        await makeRequest.post('/rso/addMembers', memberBody);
    }


    fetchEventRequests();
    } catch (error) {
      console.error('Error approving RSO request:', error);
    }
  };

  // Function to handle denial of RSO request
  const handleDeny = async (request) => {
    const body = {
      requestID: request.requestID,
      status: 1
    };

    try {
      await makeRequest.put(`/rso/setRSO`, body);

      fetchEventRequests();
    } catch (error) {
      console.error('Error denying RSO request:', error);
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
              <td>{`${request.date} (${request.time})`}</td>
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

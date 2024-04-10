import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
//import './ApproveRSORequests.scss';

const ApproveRSORequests = () => {
  // State variables to store RSO requests data
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  // Function to fetch RSO requests from the backend
  const fetchRSORequests = async () => {
    try {
      const response = await makeRequest.get('/rso/getRSORequest/' + currentUser.universityID);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching RSO requests:', error);
    }
  };

  // useEffect hook to fetch RSO requests data on component mount
  useEffect(() => {
    fetchRSORequests();
  }, []);

  // Function to handle approval of RSO request
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
    console.log(rsoBody);

    try {
      await makeRequest.post(`/rso/`, rsoBody);
      await makeRequest.put(`/rso/setRSO`, body);
      // Refetch RSO requests after approval
      fetchRSORequests();
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
      // Refetch RSO requests after denial
      fetchRSORequests();
    } catch (error) {
      console.error('Error denying RSO request:', error);
    }
  };

  return (
    <div className="approve-rso-requests">
      <h1>Approve or Deny RSO Requests</h1>
      <table>
        <thead>
          <tr>
            <th>RSO Name</th>
            <th>Description</th>
            <th>Admin Name / Email</th>
            <th>Member Emails</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.rsoName}</td>
              <td>{request.description}</td>
              <td>{`${request.user_name} / ${request.username}`}</td>
              {/*<td>{request.memberEmails.join(', ')}</td>*/}
              <td>
                <button onClick={() => handleApprove(request)}>Approve</button>
                <button onClick={() => handleDeny(request)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveRSORequests;

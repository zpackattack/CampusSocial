import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
//import './ApproveRSORequests.scss';

const ApproveRSORequests = () => {
  // State variables to store RSO requests data
  const [requests, setRequests] = useState([]);

  // Function to fetch RSO requests from the backend
  const fetchRSORequests = async () => {
    try {
      const response = await makeRequest.get('/rso-requests');
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
  const handleApprove = async (requestId) => {
    try {
      await makeRequest.put(`/rso-requests/approve/${requestId}`);
      // Refetch RSO requests after approval
      fetchRSORequests();
    } catch (error) {
      console.error('Error approving RSO request:', error);
    }
  };

  // Function to handle denial of RSO request
  const handleDeny = async (requestId) => {
    try {
      await makeRequest.put(`/rso-requests/deny/${requestId}`);
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
              <td>{`${request.adminName} / ${request.adminEmail}`}</td>
              <td>{request.memberEmails.join(', ')}</td>
              <td>
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button onClick={() => handleDeny(request.id)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveRSORequests;

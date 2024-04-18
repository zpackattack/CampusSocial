import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './rsoRequestPortal.scss';

const ApproveRSORequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [memberEmails, setMemberEmails] = useState({});


  const fetchRSORequests = async () => {
    try {
      const response = await makeRequest.get('/rso/getRSORequest/' + currentUser.universityID);
      setRequests(response.data);
      response.data.forEach(request => {
        fetchMemberEmails(request.requestID);
      });
    } catch (error) {
      console.error('Error fetching RSO requests:', error);
    }
  };

  const fetchMemberEmails = async (requestID) => {
    try {
      const response = await makeRequest.get(`/rso/getRSORequestOther/${requestID}`);
      setMemberEmails((prev) => ({
        ...prev,
        [requestID]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching member emails:', error);
    }
  };

  
  useEffect(() => {
    fetchRSORequests();
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

      fetchRSORequests();
    } catch (error) {
      console.error('Error denying RSO request:', error);
    }
  };

  return (
    <div className="rsoRequestPortal">
      {currentUser.userType >= 3 ?(
        <>
      <h1>Approve or Deny RSO Requests</h1>
      <table>
        <thead>
          <tr>
            <th>RSO Name</th>
            <th>Description</th>
            <th>Admin</th>
            <th>Other Members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.rsoName}</td>
              <td>{request.description}</td>
              <td style={{width: "20%"}}>{`${request.user_name} (${request.username})`}</td>
              <td style={{width: "20%"}}>
                {memberEmails[request.requestID]
                  ? memberEmails[request.requestID].map((member) => (
                    <div key={member.userID}>{`${member.name} (${member.username})`}</div>
                    ))
                  : 'Loading...'}
              </td>
              <td style={{width: "20%"}}>
                <button  className="approve" onClick={() => handleApprove(request)}>Approve</button>
                <button  className="deny" onClick={() => handleDeny(request)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      ):(
        <h1>You do not have access to this page. Try logging in as a super admin to access.</h1>
      )}
    </div>
  );
};

export default ApproveRSORequests;

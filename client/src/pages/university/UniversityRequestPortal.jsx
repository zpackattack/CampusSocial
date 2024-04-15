import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './UniversityRequestPortal.scss';

const UniversityRequestPortal = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);


  const fetchUniversityRequests = async () => {
    try {
      const response = await makeRequest.get('/university/universityRequest/0');
      setRequests(response.data);

    } catch (error) {
      console.error('Error fetching University requests:', error);
    }
  };

  

  
  useEffect(() => {
    fetchUniversityRequests();
  }, []);

  
  const handleApprove = async (request) => {
    const body = {
      requestID: request.universityrequestID,
      status: 2
    };

    const uniBody = {
      name: request.rsoName,
      locationID: request.locationID,
      description: request.description,
      numberOfStudents: request.numberOfStudents,
      pictures: request.pictures,
      extension: request.extension,
      instagram: request.instagram,
      twitter: request.twitter,
      facebook: request.facebook,
      logo: request.logo,
      website: request.website,
      adminName: request.adminName,
      adminEmail: request.adminEmail,
      adminPassword: request.adminPassword,
    };

    

    try {
      
      await makeRequest.post(`/university/`, body);
      await makeRequest.put(`/university/universityRequest`, body);


      fetchUniversityRequests();
    } catch (error) {
      console.error('Error approving RSO request:', error);
    }
  };

  const handleDeny = async (request) => {
    const body = {
      requestID: request.universityrequestID,
      status: 1
    };

    try {
      await makeRequest.put(`/university/universityRequest`, body);

      fetchUniversityRequests();
    } catch (error) {
      console.error('Error denying University request:', error);
    }
  };

  return (
    <div className="UniversityRequestPortal">
      {currentUser.userType >= 4 ?(
        <>
      <h1>University Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Students</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestID}>
              <td><a href={request.website} target='_blank'>{request.name}</a></td>
              <td>{request.description}</td>
              <td>{request.ext}</td>
              <td>{request.numberOfStudents}</td>
              <td style={{width: "15%"}}>{`${request.adminName} (${request.adminEmail})`}</td>
              <td>
                <button  className="approve" onClick={() => handleApprove(request)}>Approve</button>
                <button  className="deny" onClick={() => handleDeny(request)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      ):(
        <h1>You do not have access to this page. Try logging in as a mega admin to access.</h1>
      )}
    </div>
  );
};

export default UniversityRequestPortal;

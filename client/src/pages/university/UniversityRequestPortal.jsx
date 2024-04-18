import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './UniversityRequestPortal.scss';

const UniversityRequestPortal = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [uniLocations, setUniLocations] = useState({});


  const fetchUniversityRequests = async () => {
    try {
      const response = await makeRequest.get('/university/universityRequest/0');
      
      setRequests(response.data);

      response.data.forEach(request => {
        fetchUniLocations(request.universityrequestID, request.locationID);
      });

    } catch (error) {
      console.error('Error fetching University requests:', error);
    }
  };

  const fetchUniLocations = async (requestID, locationID) => {
    try {
      const response = await makeRequest.get(`/event/location?locationID=${locationID}`);
      let r = response.data;
      if (response.data.length > 0){
      console.log("locations ", response.data[0]);
      r=response.data[0]
      }
      setUniLocations((prev) => ({
        ...prev,
        [requestID]: r,
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
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
      name: request.name,
      locationID: request.locationID,
      description: request.description,
      numberOfStudents: request.numberOfStudents,
      pictures: request.pictures,
      extension: request.ext,
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
      
      await makeRequest.post(`/university/`, uniBody);
      console.log("one done");
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
              <td style={{width: "15%"}}>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${uniLocations[request.universityrequestID]?.latitude ? uniLocations[request.universityrequestID].latitude: ""},${uniLocations[request.universityrequestID]?.longitude ? uniLocations[request.universityrequestID].longitude: ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  {uniLocations[request.universityrequestID]?.name ? uniLocations[request.universityrequestID].name: "no name"}
                </a>
            </td>
              <td>{request.numberOfStudents}</td>
              <td style={{width: "15%"}}>{`${request.adminName} (${request.adminEmail})`}</td>
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
        <h1>You do not have access to this page. Try logging in as a mega admin to access.</h1>
      )}
    </div>
  );
};

export default UniversityRequestPortal;

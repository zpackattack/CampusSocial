import { useState, useEffect } from 'react';
import './CreateNewRSO.scss';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

import { makeRequest } from "../../axios";


const CreateRSORequest = () => {
  const { currentUser } = useContext(AuthContext);
  const [rsoName, setRsoName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState(['','','','']);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [texts, setTexts] = useState({
    name: "",
    userID: currentUser.userID,
    universityID: currentUser.universityID,
    status: 0,
    description: "",
    addMembers: ['','','','']
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(texts);
  };

  const handleChangeRsoName = (e) => {
    setRsoName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeMember = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index] = e.target.value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const validateEmailExtension = () => {
    const emailExtensions = members.map((email) => email.split('@')[1]);
    const firstExtension = emailExtensions[0];
    return emailExtensions.every((extension) => extension === firstExtension);
  };

  const submit = async (e) => {
    setTexts((prev) => ({ ...prev, addMembers: members }));
    try {
      // Make request to update RSO with formData
      await makeRequest.post(`/rso/rsoRequest`, texts);
      setSuccess('Request Submitted');
      setTexts({
        name: "",
        userID: currentUser.userID,
        universityID: currentUser.universityID,
        status: 0,
        description: "",
        addMembers: ['','','','']
      });
      setError("");
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating the RSO request.");
      }
      // Handle error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send request to server
    if (!validateEmailExtension()) {
        setError('All members must have the same email extension.');
        return;
    }

    const uniqueEmails = new Set(members);
    if (uniqueEmails.size !== members.length) {
        setError('Each member must have a unique email address.');
        return;
    }
    submit();
    console.log(texts);
    
  };

  return (
    <div className="CreateNewRSO">
    <div className="wrapper">
        <h2>Create RSO Request</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="rsoName">RSO Name:</label>
            <input type="text" id="rsoName" name='name' value={texts.name} onChange={handleChange} required/>
            </div>
            <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input type="textarea" id="description" name='description' value={texts.description} onChange={handleChange} required></input>
            </div>
            <div className="form-group">
            <label htmlFor="members">Other Members:</label>
            {members.map((member, index) => (
                <div key={index} className="member-input">
                <input
                key={index}
                type="member"
                value={member}
                required
                onChange={(e) => handleChangeMember(index, e)}
                />
                {index >= 4 && <button type="button" className="close" style={{marginLeft:"10%"}} onClick={() => handleRemoveMember(index)}>Remove</button>}
            </div>
            ))}
            <button type="button" onClick={handleAddMember} style={{marginTop:"3%"}}>Add Member</button>
            
            </div>
            <button type="submit">Submit Request</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </form>
    </div>
    </div>
  );
};

export default CreateRSORequest;
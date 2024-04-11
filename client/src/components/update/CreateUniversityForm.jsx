import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";

const CreateUniversityForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    locationID: 0,
    description: '',
    numberOfStudents: 0,
    pictures: '',
    extension: '',
    instagram: '',
    twitter: '',
    facebook: '',
    logo: '',
    website: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uniData = {
        name: formData.name,
        locationID: formData.locationID,
        description: formData.description,
        numberOfStudents: formData.numberOfStudents,
        pictures: formData.pictures,
        extension: formData.extension,
        instagram: formData.instagram,
        twitter: formData.twitter,
        facebook: formData.facebook,
        logo: formData.logo,
        website: formData.website,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword
      };
      
      await makeRequest.put(`/university/`, uniData);
      await makeRequest.put(`/university/`, formData);
      
    } catch (error) {
      console.error("Error updating RSO:", error);
      
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Create University Request</h1>
        <form onSubmit={handleSubmit}>
          <label>
            University Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Number of Students:
            <input
              type="text"
              name="numberOfStudents"
              value={formData.numberOfStudents}
              onChange={handleChange}
            />
          </label>
          <label>
            Link to cover picture:
            <input
              type="text"
              name="pictures"
              value={formData.pictures}
              onChange={handleChange}
            />
          </label>
          <label>
            Link to logo:
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
            />
          </label>
          <label>
            University email extension:
            <input
              type="text"
              name="extension"
              value={formData.extension}
              onChange={handleChange}
            />
          </label>
          <label>
            Instagram:
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </label>
          <label>
            X:
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
            />
          </label>
          <label>
            Facebook:
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
            />
          </label>
          <label>
          Location:
            <input
              type="text"
              name="locationID"
              value={formData.locationID}
              onChange={handleChange}
            />
          </label>
          <label>
            Your Name:
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
            />
          </label>
          <label>
            Your Email:
            <input
              type="text"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
            />
          </label>
          <label>
            Password:
            <input
               type="password"
               placeholder="Password"
               name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
            />
          </label>
          
          <button type="submit">Submit</button>
        </form>
        </div>
    </div>
  );
};

export default CreateUniversityForm;

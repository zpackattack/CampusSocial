import { useState } from "react";
import { makeRequest } from "../../axios";

const UpdateForm = ({ handleCloseModal, rso }) => {
  const [formData, setFormData] = useState({
    rsoID: rso[0].rsoID,
    name: rso[0].name,
    adminID: rso[0].adminID,
    universityID: rso[0].universityID,
    profilePicture: rso[0].profilePicture,
    rsoPicture: rso[0].rsoPicture,
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
      // Make request to update RSO with formData
      await makeRequest.put(`/rso/${rso[0].rsoID}`, formData);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating RSO:", error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        New Name:
        <input
          type="text"
          name="newName"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        New Profile Picture URL:
        <input
          type="text"
          name="newProfilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
        />
      </label>
      <label>
        New RSO Picture URL:
        <input
          type="text"
          name="newRsoPicture"
          value={formData.rsoPicture}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateForm;

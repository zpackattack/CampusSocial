import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UpdateRSO = ({ setOpenUpdate, rso }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    rsoID: rso[0].rsoID,
    name: rso[0].name,
    adminID: rso[0].adminID,
    universityID: rso[0].universityID,
    profilePicture: rso[0].profilePicture,
    rsoPicture: rso[0].rsoPicture,
  });

  const upload = async (file) => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const submit = async (e) => {
    try {
      // Make request to update RSO with formData
      await makeRequest.put(`/rso/${rso[0].rsoID}`, texts);
    } catch (error) {
      console.error("Error updating RSO:", error);
      // Handle error
    }
  };


  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image URL
    console.log("Update");
    
    submit();
    setOpenUpdate(false);
    queryClient.invalidateQueries(["rso"]);

  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update RSO</h1>
        <form>
          
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Profile Picture URL</label>
          <input
            type="text"
            value={texts.profilePicture}
            name="profilePicture"
            onChange={handleChange}
          />
          <label>RSO Picture URL</label>
          <input
            type="text"
            value={texts.rsoPicture}
            name="rsoPicture"
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
  }

 
export default UpdateRSO;

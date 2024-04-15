import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateUniversity.scss";
import axios from "axios";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { SearchResultsList } from "../../components/searchBar/SearchResultsList";
import CreateUniversityForm from "../../components/update/CreateUniversityForm";
import { makeRequest } from "../../axios";




const CreateUniversity = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    locationName: "",
    longitude: -73.965355,
    latitude: 40.782864,
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
        locationName: formData.locationName,
        longitude: formData.longitude,
        latitude: formData.latitude,
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
      console.log(uniData);
      
      await makeRequest.post(`/university/universityRequest`, uniData);

      navigate("/checkBack");
      
    } catch (error) {
      console.error("Error updating RSO:", error);

      setErrorMessage("An error occurred while submitting the form. Please try again.");
      
    }
  };

  useEffect(() => {
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: formData.latitude, lng: formData.longitude },
      zoom: 12,
    });

    const input = document.getElementById("locationName");
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    const marker = new window.google.maps.Marker({
      position: { lat: formData.latitude, lng: formData.longitude },
      map: map,
      draggable: true,
    });

    marker.addListener("dragend", (e) => {
      const newPosition = e.latLng.toJSON();
      setFormData((prev) => ({
        ...prev,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      }));
    });

    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }
    
      
      const location = place.geometry.location;
      map.setCenter(location);
      map.setZoom(17);
      marker.setPosition(location);
    
      
      setFormData((prev) => ({
        ...prev,
        locationName: place.name,
        latitude: location.lat(),
        longitude: location.lng(),
      }));
    });
  };


  return (
    <div className="createUniversity">
      <div className="card">
      <div className="right">
      <h1>Create University Request</h1>
        <form onSubmit={handleSubmit}>
          <label>
            University Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Number of Students:
            <input
              type="text"
              name="numberOfStudents"
              value={formData.numberOfStudents}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Website:
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
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
              required
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
          <label>Location</label>
          <input
            id="locationName"
            type="text"
            value={formData.locationName}
            name="locationName"
            onChange={handleChange}
            required
          />
          <div id="map" style={{ height: "300px", width: "100%" }}></div>
          <label>
            Your Name:
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Your Email:
            <input
              type="text"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              required
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
              required
            />
          </label>
          {errorMessage && (
            <div className="error-message" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}
          <button type="submit">Submit</button>
          </form>
      </div>
      </div>
    </div>
  );
};

export default CreateUniversity;

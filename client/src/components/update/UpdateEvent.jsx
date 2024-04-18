import { useState, useEffect  } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const UpdateEvent = ({ setOpenUpdate, event, location }) => {
  const { currentUser } = useContext(AuthContext);
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
  const [texts, setTexts] = useState({
    name: event.name,
    category: event.category,
    description: event.descriptions,
    time: event.time,
    date: formatDate(event.date),
    contactPhone: event.contactPhone,
    contactEmail: event.contactEmail,
    eventType: event.eventType,
    locationName: location.name,
    longitude: location.longitude,
    latitude: location.latitude,
  });



  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const submit = async (e) => {
    const body={
      eventID: event.eventID,
      name: texts.name,
      category: texts.category,
      description: texts.description,
      contactPhone: texts.contactPhone,
      contactEmail: texts.contactEmail,
      eventType: texts.eventType,
      date: texts.date,
      time: texts.time
    };

    const locBody = {
      locationID: location.locationID,
      name: texts.locationName,
      longitude: texts.longitude,
      latitude: texts.latitude
    }

    try {
      console.log(body);
      await makeRequest.put(`/event/location`, locBody);
      await makeRequest.put(`/event/`, body);
    } catch (error) {
      console.error("Error creating event:", error);
     
    }
  };


  const handleClick = async (e) => {
    e.preventDefault();
    const form = e.target;
    console.log("Update");
    if (form.checkValidity()) {
    submit();
    setOpenUpdate(false);
    queryClient.invalidateQueries(["events"]);
    }
    else{
      
      form.reportValidity();
    }

  };

  useEffect(() => {
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAQiHDZunNw-NEmSJ8za2IahvcGuXg2x0w&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChangeLoc = (e) => {
    const { name, value } = e.target;
    setTexts((prev) => ({ ...prev, [name]: value }));
    updateMap(value);
  };

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: texts.latitude, lng: texts.longitude },
      zoom: 12,
    });

    const input = document.getElementById("locationName");
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    const marker = new window.google.maps.Marker({
      position: { lat: texts.latitude, lng: texts.longitude },
      map: map,
      draggable: true,
    });

    marker.addListener("dragend", (e) => {
      const newPosition = e.latLng.toJSON();
      setTexts((prev) => ({
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
    
      
      setTexts((prev) => ({
        ...prev,
        locationName: place.name,
        latitude: location.lat(),
        longitude: location.lng(),
      }));
    });
  };
  
  


  const updateMap = () => {

  }
 



  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setTexts((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Create Event</h1>
        <form onSubmit={handleClick}>
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
            required
          />
          <label>Event Type</label>
          <select
            name="eventType"
            value={texts.eventType}
            onChange={handleChange}
          >
            <option value="RSO">RSO</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          <label>Category</label>
          <input
            type="text"
            value={texts.category}
            name="category"
            onChange={handleChange}
            required
          />
          <label>Description</label>
          <input
            type="text"
            value={texts.description}
            name="description"
            onChange={handleChange}
            required
          />
          <label>Contact Number</label>
          <input
            type="text"
            value={texts.contactPhone}
            name="contactPhone"
            onChange={handleChange}
            required
          />
          <label>Time</label>
          <input
            type="time"
            value={texts.time}
            name="time"
            onChange={handleChange}
            required
          />
          <label>Date</label>
          <input
            type="date"
            value={texts.date}
            name="date"
            onChange={handleChange}
            required
          />
          <label>Location</label>
          <input
            id="locationName"
            type="text"
            value={texts.locationName}
            name="locationName"
            onChange={handleChange}
            required
          />
          <div id="map" style={{ height: "300px", width: "100%" }}></div>
          <button type="submit" >Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
            X
        </button>
      </div>
    </div>
  );
  }

 
export default UpdateEvent;

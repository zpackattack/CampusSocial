import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import RSOList from "../../components/posts/RSOList";
import { IconBrandFacebook, IconBrandX } from '@tabler/icons-react';
import { DarkModeContext } from "../../context/darkModeContext";

const University = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const iconColor = darkMode ? 'white' : 'black';
  const [location, setLocation] = useState(null);
  const [admin, setAdmin] = useState(null);

  const universityId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["university"], () =>
    makeRequest.get("/university/id/" + currentUser.universityID).then((res) => {
      console.log("uni", res.data);
      fetchLocation();
      fetchContact();
      return res.data[0];
    })
  );
  

  const fetchLocation = async () => {
    try {
      
      const response = await makeRequest.get("/event/location?locationID=" + data.locationID);
      const { location } = response.data;
      console.log("location Object: " + response.data);
      setLocation(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation(null); // Set default value in case of error
    }
  };



  const fetchContact = async () => {
    try {
      
      const response = await makeRequest.get("/users/" + data.adminID);
      console.log(response.data);
      setAdmin(response.data[0]);
    } catch (error) {
      console.error("Error fetching admin:", error);
      setAdmin(null); // Set default value in case of error
    }
  };
  
  

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
          {data[0]?.pictures ? (
              <img src={data[0].pictures} alt="" className="cover" />
            ) : (
           <img src="https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-1200-80.jpg" alt="" className="cover" />
          )}
           {data[0]?.logo ? (
              <img src={data[0].logo} alt="" className="profilePic" />
            ) : (
              <img src="https://cdn2.iconfinder.com/data/icons/maki/100/college-512.png" alt="" className="profilePic" />
            )}
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                {data.facebook && (
                <a href={data.facebook} target="_blank">
                  <IconBrandFacebook size={32} color={iconColor}/>
                </a>
                )}
                {data.instagram && (
                <a href={data.instagram} target="_blank">
                  <InstagramIcon fontSize="large"/>
                </a>
                )}
                {data.twitter && (
                <a href={data.twitter} target="_blank">
                  <IconBrandX size={32} color={iconColor}/>
                </a>
                )}
                
              </div>
              <div className="center">
                <h1 style={{textAlign:"center"}}>{data.name}</h1>
                <div className="info">
                  <div className="item">
                  {data.locationID ? (
                    <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location ? location.latitude: ""},${location ? location.longitude: ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlaceIcon />
                    </a>
                  ):(
                    <PlaceIcon />
                  )}
                  </div>
                  <div className="item">
                    {data.website ? (
                      <a href={data.website}
                      target="_blank"
                    >
                    <LanguageIcon />
                    </a>

                    ):(
                      <LanguageIcon />
                    )}
                  </div>
                </div>
                {/*<span>{data.description}</span>*/}
              </div>
              <div className="right">
              {admin?.username ? (
                <a href={'mailto:' + admin.username}>
                <EmailOutlinedIcon />
                </a>
              ):(<></>)}
                {/*<MoreVertIcon />*/}
              </div>
              
            </div>
            <RSOList query="/rso/getUniversityRSOs/" universityID={universityId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default University;


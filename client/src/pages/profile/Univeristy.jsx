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
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import RSOList from "../../components/posts/RSOList";
import { IconBrandFacebook, IconBrandX, IconBrandInstagram } from '@tabler/icons-react';
import { DarkModeContext } from "../../context/darkModeContext";

const University = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const iconColor = darkMode ? 'white' : 'black';
  const [location, setLocation] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [rsoCount, setRSOCount] = useState(0);

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
      setAdmin(null); 
    }
  };

  const fetchRSOCount = async () => {
    try {
      
      const response = await makeRequest.get("/rso/getUniversityRSOCount/" + currentUser.universityID);
      setRSOCount(response.data.rsoCount);
    } catch (error) {
      console.error("Error fetching admin:", error);
      setRSOCount(0); 
    }
  };
  
  

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
          {data?.pictures ? (
              <img src={data.pictures} alt="" className="cover" />
            ) : (
           <img src="https://research.collegeboard.org/media/2022-02/iStock_000021255451_Large-780x585.jpg" alt="" className="cover" />
          )}
           {data?.logo ? (
              <img src={data.logo} alt="" className="profilePic" />
            ) : (
              <img src="https://w7.pngwing.com/pngs/72/570/png-transparent-teachers-college-columbia-university-academic-degree-student-course-graduation-people-university-higher-education.png" alt="" className="profilePic" />
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
                <a href={data.instagram} target="_blank" style={{color:{iconColor}}}>
                  <IconBrandInstagram size={32} color={iconColor}/>
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
                      color="white"
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
            <div className="uInfo">
            <div className="center">
                <h3 style={{textAlign:"left"}}>{data.description}</h3>
                <div className="info">
                  <div className="item">
                    <PersonIcon />
                    {data.numberOfStudents}

                  </div>
                  <div className="item">
                    
                    <SchoolIcon />
                    {rsoCount}

                  </div>
                </div>
                {/*<span>{data.description}</span>*/}
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


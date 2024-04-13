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
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import RSOList from "../../components/posts/RSOList";
import { IconBrandFacebook, IconBrandX } from '@tabler/icons-react';

const University = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const universityId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["university"], () =>
    makeRequest.get("/university/id/" + currentUser.universityID).then((res) => {
      console.log("uni", res.data);
      return res.data[0];
    })
  );

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
           <img src="https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-1200-80.jpg" alt="" className="cover" />
            {/*<img src={"/upload/"+data.profilePic} alt="" className="profilePic" />*/}
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                {data.facebook && (
                <a href={data.facebook} target="_blank">
                  <IconBrandFacebook size={32} />
                </a>
                )}
                {data.instagram && (
                <a href={data.instagram} target="_blank">
                  <InstagramIcon fontSize="large" />
                </a>
                )}
                {data.twitter && (
                <a href={data.twitter} target="_blank">
                  <IconBrandX size={32} />
                </a>
                )}
                
              </div>
              <div className="center">
                <h1 style={{textAlign:"center"}}>{data.name}</h1>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    {/*<span>{data.locationID}</span>*/}
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    {/*<span>{data.website}</span>*/}
                  </div>
                </div>
                {/*<span>{data.description}</span>*/}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
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


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
import { useState } from "react";
import CreateEvent from "../../components/update/CreateEvent";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [openCreate, setOpenCreate] = useState(false);


  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + currentUser.userID).then((res) => {
      console.log(res.data);
      return res.data;
    })
  );


  const queryClient = useQueryClient();

  const logout = ()=>{
    navigate("/login");
  }


 

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          {/*<div className="images">
          <img src="https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-1200-80.jpg" alt="" className="cover" />
            <img src={"/upload/"+data.profilePic} alt="" className="profilePic" />
          </div>*/}
          <div className="profileContainer">
            <div className="uInfo">
              
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  {data.userID === currentUser.userID ? (
                    <>
                    <div className="item">
                    <button style={{backgroundColor:"#f0544f"}} onClick={() => logout()}>Logout</button>
                    </div>
                    {currentUser.userType>=1 && (
                    <div className="item">
                    <button onClick={() => setOpenCreate(true)}>Create Event</button>
                    </div>
                    )}
                    </>
                  ):(
                    <span></span>
                  )}
                  
                </div>
                
                
              </div>
            </div>
            <Posts query="/event/getPosterEvents?userID=" />
          </div>
        </>
      )}
      {openCreate && <CreateEvent setOpenCreate={setOpenCreate} />}
    </div>
  );
};

export default Profile;


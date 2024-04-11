import "./RSOListElement.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect  } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Rating } from "@mui/material";
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PersonIcon from '@mui/icons-material/Person';
import ShareButtons from "./share";

const RSOListElement = ({ rso }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [recall, setRecall] = useState(-99);
  const [joined, setJoined] = useState(false);
  const queryClient = useQueryClient(); 

  const { currentUser } = useContext(AuthContext);
  

  const fetchJoined = async () => {
    try {
      const res = await makeRequest.get("/rso/checkUserInRSO/" + currentUser.userID +"/"+rso.rsoID);
      console.log("joined " + res.data);
      setJoined(res.data.isMember);
    } catch (error) {
      console.error("Error fetching joined:", error);
      setJoined(false); 
    }
  };

  const fetchMemCount = async () => {
    try {
      const response = await makeRequest.get("rso/memberCount/"+rso.rsoID);
      setMemberCount(response.data.count);
    } catch (error) {
      console.error("Error fetching average rating:", error);
      setMemberCount(0); 
    }
  };

  useEffect(() => {
    fetchMemCount();
    fetchJoined();
    
  }, [rso.rsoID]);



  const joinRSO = useMutation((rsoID) =>
  makeRequest.post("/rso/addMembers", {
    userID: currentUser.userID,
    rsoID: rsoID,
  }),
  {
    onSuccess: () => {
      fetchMemCount();
      console.log("user un-added from rso");
    },
  }
);

const leaveRSO = useMutation(
  () => makeRequest.delete(`/rso/deleteMember/${currentUser.userID}/${rso.rsoID}`),
  {
    onSuccess: () => {
      fetchMemCount();
      console.log("user un-added from rso");
    },
  }
);

  const handleAdd = () => {
    if(!joined){
      joinRSO.mutate(rso.rsoID);
    }
    else{
      leaveRSO.mutate(rso.rsoID);
    }
    setJoined(!joined);
  };

  return (
    <div className="RSOListElement">
      <div className="container">
        <div className="user">
        <Link to={`/rso/${rso.rsoID}`} className="userInfo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="userInfo">
            {rso.rsoPicture ? (
              <img src={rso.profilePicture} alt="" className="cover" />
            ) : (
              <img src="https://www.pngkey.com/png/detail/110-1105440_college-clipart-pennants-college-pennant-clipart.png" alt="" className="cover" />
            )}
            <div className="details">
              <h1 className="name">{rso.name}</h1>
            </div>
            <div className="info">
              <div className="item">
                <PersonIcon />
                {memberCount}
              </div>
            </div>
            
          </div>
          </Link>
          
          <button onClick={handleAdd} style={joined ? {
        "background-color": "#f0544f"
      } : {"background-color": "#5271ff"}}>
                    {joined
                      ? "Leave"
                      : "Join"}
                  </button>
        </div>
        
      </div>
    </div>
  );
};

export default RSOListElement;

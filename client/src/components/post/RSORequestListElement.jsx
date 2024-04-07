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

const RSORequestListElement = ({ request }) => {
  const [recall, setRecall] = useState(-99);
  const [joined, setJoined] = useState(false);
  const queryClient = useQueryClient(); 

  const { currentUser } = useContext(AuthContext);

  const getStatusInfo = (status) => {
    let statusText;
    let color;

    switch (status) {
      case 0:
        statusText = "Pending";
        color = "#faaf00";
        break;
      case 1:
        statusText = "Denied";
        color = "#f0544f";
        break;
      case 2:
        statusText = "Approved";
        color = "green";
        break;
      default:
        statusText = "Unknown";
        color = "black";
    }

    return { statusText, color };
  };
  const { statusText, color } = getStatusInfo(request.status);

  return (
    <div className="RSOListElement">
      <div className="container">
        <div className="user">
          <div className="userInfo" style={{width: "100%"}}>
            <div className="details">
              <h1 className="name">{request.rsoName}</h1>
            </div>
            <div style={{textAlign: "right", color: color}}>
                  Status: {statusText}
            </div> 
            
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default RSORequestListElement;

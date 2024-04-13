import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PublicIcon from '@mui/icons-material/Public';
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
import ShareButtons from "./share";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [recall, setRecall] = useState(-99);

  const { currentUser } = useContext(AuthContext);
  //console.log(post);
  const { isLoading, error, data: location } = useQuery(["location", post.locationID], () =>
  makeRequest.get("/event/location?locationID=" + post.locationID).then((res) => {
    //console.log(res.data);
    return res.data[0]; // Return the entire data object
  }).catch(error => {
    console.error("Error fetching location:", error);
    return null; // Return null or any default value in case of an error
  })
);

  //console.log(location? location.name : "");
  const fetchAverageRating = async () => {
    try {
      const response = await makeRequest.get(`/comments/avgRating/${post.eventID}`);
      const { averageRating } = response.data;
      //console.log(averageRating);
      setAverageRating(averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
      setAverageRating(0); // Set default value in case of error
    }
  };
  useEffect(() => {
    // Fetch the average rating for the post


    fetchAverageRating();
  }, [post.eventID]);

  const fetchCommentCount = async () => {
    try {
      const response = await makeRequest.get(`/comments/count/${post.eventID}`);
      const { totalCommentCount } = response.data;
      //console.log(totalCommentCount);
      setCommentCount(totalCommentCount);
    } catch (error) {
      console.error("Error fetching comment count:", error);
      setCommentCount(0); // Set default value in case of error
    }
  };

  useEffect(() => {
    // Fetch the average rating for the post


    fetchCommentCount();
  }, [post.eventID]);
  
  const recallAllAPIs = async () => {
    try {
      await Promise.all([
        fetchAverageRating(),
        fetchCommentCount()
      ]);
    } catch (error) {
      console.error("Error recalling APIs:", error);
    }
  };

  const formattedDate = moment(post.date).format("MMMM DD, YYYY");
  const formattedTime = moment(post.time, "HH:mm:ss").format("hh:mm A");
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {/*<img src={"/upload/"+post.profilePic} alt="" />*/}
            <div className="details">
              <h1 className="name">{post.name}</h1>
              
            {/*<span className="date">{moment(post.createdAt).fromNow()}</span>*/}
            </div>
            
          </div>
          {post.posterID === currentUser.userID && (
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />)}
          {menuOpen && post.posterID === currentUser.userID && (
            <button onClick={fetchCommentCount()}>delete</button>
          )}
        </div>
        <div className="info">
        <div className="item">
          <AccessTimeFilledIcon />
          {formattedDate} at {formattedTime}
        </div>
        </div>
        <div className="info">
        <div className="item">
            <LocationOnIcon />
            <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location ? location.latitude: ""},${location ? location.longitude: ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
            {location ? location.name: "no name"}
            </a>
          </div>
          
          {/*<img src={"/upload/" + post.img} alt="" />*/}
        </div>
        <div className="info">
        <div className="item">
          <CategoryIcon />
          {post.category}
        </div>
        </div>
        <div className="content">
          <p>{post.descriptions}</p>
          {/*<img src={"/upload/" + post.img} alt="" />*/}
        </div>
        <div className="info">
          
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item" onClick={() => window.location.href = `tel:${post.contactPhone}`}>
            <LocalPhoneIcon />
            {post.contactPhone}
          </div>
          <div className="item" onClick={() => window.location.href = `mailto:${post.contactEmail}`}>
            <MailOutlineIcon />
            {post.contactEmail}
          </div>
          <div className="item">
            <ShareButtons event={post} />
          </div>
          <div className="item">
            <Rating name="half-rating-read" value={averageRating} precision={0.5} readOnly />
            <p>({commentCount})</p>
          </div>
          <div className="item" onClick={() => window.location.href = `mailto:${post.contactEmail}`}>
            <PublicIcon />
            {post.eventType}
          </div>
        </div>
        {commentOpen && <Comments postId={post.eventID} recallState={recallAllAPIs}/>}
      </div>
    </div>
  );
};

export default Post;

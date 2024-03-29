import "./post.scss";
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
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  console.log(post);
  const { isLoading, error, data: location } = useQuery(["location", post.locationID], () =>
  makeRequest.get("/event/location?locationID=" + post.locationID).then((res) => {
    console.log(res.data);
    return res.data[0]; // Return the entire data object
  }).catch(error => {
    console.error("Error fetching location:", error);
    return null; // Return null or any default value in case of an error
  })
);

  console.log(location? location.name : "");
  //const queryClient = useQueryClient();

  /*const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.userID));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.eventID);
  };
*/
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
          
          {/*<MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}*/}
        </div>
        <div className="content">
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
        <div className="content">
          <p>{post.descriptions}</p>
          {/*<img src={"/upload/" + post.img} alt="" />*/}
        </div>
        <div className="info">
          {/*<div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.userID) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>*/}
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
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.eventID} />}
      </div>
    </div>
  );
};

export default Post;

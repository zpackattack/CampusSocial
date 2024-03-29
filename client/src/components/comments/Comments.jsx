import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import StarIcon from "@mui/icons-material/Star";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments", postId], () =>
    makeRequest.get("/comments?eventID=" + postId).then((res) => {
      console.log(res.data);
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<StarIcon style={{ color: "gold" }} />);
    }
    return stars;
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment">
              {/*<img src={"/upload/" + comment.profilePic} alt="" />*/}
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.comment}</p>
              </div>
              <div className="stars">{renderStars(comment.rating)}</div>
              
            </div>
          ))}
    </div>
  );
};

export default Comments;

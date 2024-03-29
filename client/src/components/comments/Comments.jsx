import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";

const Comments = ({ postId, recallState }) => {
  const [desc, setDesc] = useState("");
  const [rat, setRat] = useState(0);
  const [editing, setEditing] = useState(false);
  const [currentComment, setCurrentComment] = useState(-1);
  const { currentUser } = useContext(AuthContext);
  
  const [inputs, setInputs] = useState({
    userID: currentUser.userID,
    eventID: postId,
    comment: desc,
    rating: rat,
  });
  console.log(inputs);
  const { isLoading, error, data } = useQuery(["comments", postId], () =>
    makeRequest.get("/comments?eventID=" + postId).then((res) => {
      console.log(res.data);
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      setInputs((prev) => ({ ...prev, comment: desc, rating: rat }));
      return makeRequest.post("/comments", inputs);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments", postId]);
        recallState();
      },
    }
  );
  const ed = useMutation(
    (commentID) => {
      setInputs((prev) => ({ ...prev, comment: desc, rating: rat }));
      return makeRequest.put("/comments",currentComment, inputs);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments", postId]);
        recallState();
      },
    }
  );

  const handleEdit = async (commentID, comment, rating) => {
    // Logic for editing comment
    setCurrentComment(commentID);
    setDesc(comment);
    setRat(rating);
    setEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const editedComment = {
        commentID: currentComment,
        userID: currentUser.userID,
        rating: rat,
        comment: desc,
      };
  
      // Call the API to update the comment
      await makeRequest.put(`/comments`, editedComment);
  
      // Invalidate the query to refresh the comments list
      queryClient.invalidateQueries(["comments", postId]);
      recallState();
      
      // Reset state values
      setDesc("");
      setRat(0);
      setEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error);
      // Handle error if necessary
    }
  };


    const handleDelete = async (commentId) => {
    // Prompt confirmation from the user
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
    
    if (isConfirmed) {
      try {
        // Call the API to delete the comment
        await makeRequest.delete(`/comments/:id?commentID=${commentId}&userID=${currentUser.userID}`);
        
        // Invalidate the query to refresh the comments list
        queryClient.invalidateQueries(["comments", postId]);
        recallState();
      } catch (error) {
        console.error("Error deleting comment:", error);
        // Handle error if necessary
      }
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    mutation.mutate({ postId, desc, rat});
    setDesc("");
    setRat(0);
  };

  return (
    <div className="comments">
      <div className="write">
        
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => {
            setInputs((prev) => ({ ...prev, comment: e.target.value }));
            console.log(inputs)
            setDesc(e.target.value);
          }
          }
        />
        <Rating
          name="simple-controlled"
          value={rat}
          onChange={(event, newValue) => {
            setInputs((prev) => ({ ...prev, rating: newValue }));
            setRat(newValue);
          }}
        />
        <button onClick={editing ? handleEditSubmit : handleClick}>Send</button>
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
              <div>{comment.userID === currentUser.userID && ( // Render edit and delete buttons only if current user is the one who commented
                <>
                  <button onClick={() => handleEdit(comment.commentID, comment.comment, comment.rating)}>Edit</button>
                  <button onClick={() => handleDelete(comment.commentID)}>Delete</button>
                </>
              )}
            </div>
              <div className="stars"><Rating name="read-only" value={comment.rating} readOnly />{/*{renderStars(comment.rating)}*/}</div>
              
            </div>
          ))}
    </div>
  );
};

export default Comments;

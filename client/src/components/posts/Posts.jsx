import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({userId}) => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["event"], () =>
    makeRequest.get("/event/getUserEvents?userID="+ currentUser.userID).then((res) => {
      console.log(res.data);
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((event) => <Post post={event} key={event.eventID} />)}
    </div>
  );
};

export default Posts;

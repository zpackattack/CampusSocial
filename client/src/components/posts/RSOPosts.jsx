import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const RSOPosts = ({rsoID}) => {
  const { isLoading, error, data } = useQuery(["rsoevent"], () =>
    makeRequest.get("/event/rso/"+ rsoID).then((res) => {
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
        : data.map((event) => <Post post={event} />)}
    </div>
  );
};

export default RSOPosts;

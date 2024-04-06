import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext, useContext } from "../../context/authContext";
import RSOListElement from "../post/RSOListElement";

const RSOList = ({query, universityID}) => {
  //const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["rsoevent"], () =>
    makeRequest.get(query+ universityID).then((res) => {
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
        : data.map((event) => <RSOListElement rso={event} key={event.eventID} />)}
    </div>
  );
};

export default RSOList;

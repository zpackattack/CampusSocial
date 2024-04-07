import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import RSOListElement from "../post/RSOListElement";
import RSORequestListElement from "../post/RSORequestListElement";

const RSORequestList = () => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["rsorequests"], () =>
    makeRequest.get("/rso/userRSORequests/"+ currentUser.userID).then((res) => {
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
        : data.map((request) => <RSORequestListElement request={request} key={request.requestID} />)}
    </div>
  );
};

export default RSORequestList;

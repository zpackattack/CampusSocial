import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["event"], () =>
    makeRequest.get("/rso/getNotUserRSO?universityID="+currentUser.universityID+"&userID="+ currentUser.userID).then((res) => {
      console.log("here");
      console.log(res.data);
      
      return res.data;
    })
  );


  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggested RSOs</span>
          {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((r) => <>
            <div className="user">
              <div className="userInfo">
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <span>{r.name}</span>
              </div>
              <div className="buttons">
                <button>follow</button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;

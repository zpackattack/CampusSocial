import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(["rso"], () =>
    makeRequest.get("/rso/getNotUserRSO?universityID="+currentUser.universityID+"&userID="+ currentUser.userID)
      .then((res) => {
        console.log("here");
        console.log(res.data);
        return res.data;
      })
  );

  const joinRSO = useMutation((rsoID) =>
    makeRequest.post("/rso/addMembers", {
      userID: currentUser.userID,
      rsoID: rsoID,
    })
  );

  const handleJoin = (rsoID) => {
    joinRSO.mutate(rsoID);
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggested RSOs</span>
          {error
            ? "Something went wrong!"
            : isLoading
            ? "loading"
            : data.map((r) => (
                <div className="user" key={r.rsoID}>
                  <div className="userInfo">
                    <img
                      src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                      alt=""
                    />
                    <span>{r.name}</span>
                  </div>
                  <div className="buttons">
                    <button onClick={() => handleJoin(r.rsoID)}>join</button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;

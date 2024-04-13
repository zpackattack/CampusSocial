import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data, refetch } = useQuery(["rsoSide"], () =>
    makeRequest.get("/rso/getNotUserRSO/"+currentUser.universityID+"/"+ currentUser.userID)
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
    queryClient.invalidateQueries(["rsoSide"]);
    refetch();
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
                  <Link to={`/rso/${r.rsoID}`} className="userInfo" style={{ textDecoration: 'none', color: 'inherit' }} reloadDocument >
                  <div className="userInfo">
                  {r.rsoPicture ? (
                    <img src={r.profilePicture} alt="" className="cover" />
                    ) : (
                      <img src="https://www.pngkey.com/png/detail/110-1105440_college-clipart-pennants-college-pennant-clipart.png" alt="" className="cover" />
                    )}
                    
                    <span>{r.name}</span>
                  </div>
                  </Link>
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

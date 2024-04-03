import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const RSO = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [joined, setJoined] = useState(false);
  const queryClient = useQueryClient(); 

  const rsoID = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["rso"], () =>
    makeRequest.get("/rso/" + rsoID).then((res) => {
      
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["following"],
    () =>
      makeRequest.get("rso/checkUserInRSO/" + currentUser.userID +"/"+rsoID).then((res) => {
        setJoined(res.data.isMember);
        return res.data.isMember;
      })
  );

  const { isLoading: memsIsLoading, data: memberCount } = useQuery(
    ["memCount"],
    () =>
      makeRequest.get("rso/memberCount/"+rsoID).then((res) => {
        console.log("rso", res.data.count);
        return res.data.count;
      })
  );
/*
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
*/

const joinRSO = useMutation((rsoID) =>
  makeRequest.post("/rso/addMembers", {
    userID: currentUser.userID,
    rsoID: rsoID,
  }),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["memCount"]);
      console.log("user un-added from rso");
    },
  }
);

const leaveRSO = useMutation(
  () => makeRequest.delete(`/rso/deleteMember/${currentUser.userID}/${rsoID}`),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["memCount"]);
      console.log("user un-added from rso");
    },
  }
);

const handleAdd = () => {
  if(!joined){
    joinRSO.mutate(rsoID);
  }
  else{
    leaveRSO.mutate(rsoID);
  }
  setJoined(!joined);
};


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
          {data[0].rsoPicture ? (
              <img src={data[0].rsoPicture} alt="" className="cover" />
            ) : (
              <img src="https://cdn.mos.cms.futurecdn.net/wtqqnkYDYi2ifsWZVW2MT4-1200-80.jpg" alt="" className="cover" />
            )}
            {data[0].profilePicture ? (
              <img src={data[0].profilePicture} alt="" className="profilePic" />
            ) : (
              <img src="https://www.pngkey.com/png/detail/110-1105440_college-clipart-pennants-college-pennant-clipart.png" alt="" className="profilePic" />
            )}
            
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              
              <div className="center">
                <span>{data[0].name}</span>
                  <div className="item">
                    <PersonIcon />
                    <span>{memberCount}</span>
                  </div>
                {rIsLoading ? (
                  "loading"
                ) : data[0].adminID === currentUser.userID ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleAdd}>
                    {joined
                      ? "Leave"
                      : "Join"}
                  </button>
                )}
                {/*<span>{data.description}</span>*/}
              </div>

              
            </div>
                                {/*<Posts userId={userId} />*/}
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default RSO;


import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"
import RSOList from "../../components/posts/RSOList"
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";


const JoinedRSO = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      <RSOList query="/rso/getUserRSOs/" universityID={currentUser.userID} />
    </div>
  )
}

export default JoinedRSO;

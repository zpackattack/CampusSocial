
import "./home.scss"
import RSOList from "../../components/posts/RSOList"
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";


const YourAdminRSOs = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      <RSOList query="/rso/getAdminRSOs/" universityID={currentUser.userID} />
    </div>
  )
}

export default YourAdminRSOs;

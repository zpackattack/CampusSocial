import Posts from "../../components/posts/Posts"
import "./home.scss"

const Home = () => {
  return (
    <div className="home">
      <Posts query = "/event/getUserEvents?userID="/>
    </div>
  )
}

export default Home
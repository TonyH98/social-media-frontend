
import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from './Components/Registration/Signup';
import Nav from './Components/Nav/Nav';
import Home from './Components/LandingPage/Home';
import Profile from './Components/Profile/Profile';
import SearchPosts from './Components/SearchPosts/SearchPosts';
import PostsDetails from './Components/PostsDetails/PostsDetails';
import OtherProfile from './Components/OtherProfile/OtherProfile'
import Followings from './Components/Following/Followings';
import Followers from './Components/Following/Followers';
import Notifications from './Components/Notifications/Notifications';
import Footer from './Components/Footer/Footer';
import axios from 'axios';


const API = process.env.REACT_APP_API_URL;
function App() {

  const [user, setUser] = useState();
  const [plan , setPlan] = useState({})

  const [isLogged, setIsLogged] = useState(false);
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const newLogin = () => {
    setIsLogged(!isLogged);
  };


  useEffect(() => {
    const loggedUser = JSON.parse(window.localStorage.getItem('user'));
    setUser(loggedUser);
  }, [isLogged]);


  useEffect(() => {
    if (user?.id) {
      axios.get(`${API}/plans/${user?.id}/plan`)
        .then((res) => {
          if (res.data) {
            setPlan(res.data);
          } else {
            setPlan(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching plan data:", error);

        });
    }
  }, [user?.id, isLogged]);
  

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  return (
    <div className="App">
    <Router>
    <div className="navbar">
        {user ? <Nav user={user} plan={plan}/> : null}
      </div>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home newLogin={newLogin} isLogged={isLogged} setUser={setUser} user={user}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path={`/profile/${user?.id}`} element={<Profile user={user} plan={plan}/>} />
          <Route path="/posts/:tag_name" element={<SearchPosts/>}/>
          <Route path={`/posts/:username/:id`} element={<PostsDetails user={user} plan={plan}/>}/>
          <Route path={`/profiles/:id`} element={<OtherProfile user={user} plan={plan}/>}/>
          <Route path={`/:id/following`} element={<Followings user={user}/>}/>
          <Route path={`/:id/follower`} element={<Followers user={user}/>}/>
          <Route path={`/notifications/:id`} element={<Notifications/>}/>
        </Routes>
      </main>
      <div className="footer" style={{ display: screenWidth >= 993 ? 'block' : 'none' }}>
          {user ? <Footer user={user} /> : null}
        </div>
    </Router>
  </div>
  );
}

export default App;

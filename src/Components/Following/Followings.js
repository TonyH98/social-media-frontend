import { useEffect , useState} from "react";
import { getFollowing} from "../../Store/userActions";
import { useDispatch , useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Following from "./Following";
import "./Following.css"

import axios from "axios";

const API = process.env.REACT_APP_API_URL;
function Followings({user, mainUser}){

    let {id} = useParams()
    let [users , setUsers] = useState([])
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path ? 'active3' : ''
      }

const dispatch = useDispatch();

let following = useSelector((state) => state.follow.fol)


useEffect(() => {
    axios.get(`${API}/users/${id}`)
    .then((res) => {
        setUsers(res.data)
    })
     }, [id])

 useEffect(() => { 
    if(id){
      dispatch(getFollowing(id))
    }
 }, [dispatch, id])


 console.log(user)
return(

    <div className="users_following_container">
        <div className="following_first_section">

            <div className="user_names_container">
            <h2 className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>{users?.profile_name}</h2>
            <span className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>@{users?.username}</span>
            </div>

            <div className="followe_links">
                <Link to={`/${users?.id}/following`} className={isActive(`/${users?.id}/following`)}>
                <button className={`${users?.dark_mode ? 'white_text' : 'dark_text'} follow_link`}>Following</button>
                </Link>

                <Link to={`/${mainUser?.id}/follower`} className={isActive(`/${users?.id}/follower`)}>
                <button className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} follow_link`}>Followers</button>
                </Link>
            </div>
        
        </div>

        <div className="following_second_section">
            {following.length === 0 ? <h1>Empty</h1> : 
                <div>
                    {following.map((fol) => {
                        return(
                            <Following fol={fol} users={users} user={user} mainUser={mainUser}/>
                        )
                    })}

                </div>

            }
        </div>

    </div>

)

}

export default Followings
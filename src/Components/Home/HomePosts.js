

import {Link} from "react-router-dom"
import {SlBubble} from "react-icons/sl"
import ReplyForm from "../ReplyForm/ReplyForm";
import {AiFillHeart} from "react-icons/ai"
import {AiOutlineHeart} from "react-icons/ai"
import { useEffect , useState } from "react";
import { useDispatch} from "react-redux";
import { addFav , deleteFav} from "../../Store/userActions";
import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai"
import {PiArrowsClockwise} from "react-icons/pi"
import axios from "axios";

const API = process.env.REACT_APP_API_URL;
function HomePost ({posts, favorites, plan, mainUser, setFavorites}){

console.log(posts)

let [show , setShow] = useState(false)


let [fav] = useState({
    creator_id: posts.creator.id
})

let [likes] = useState({
    reaction: "like"
})

let [dislike] = useState({
    reaction: "dislike"
})

let [replies , setReplies] = useState([])

useEffect(() => {
    axios.get(`${API}/users/${posts.creator.username}/posts/${posts.id}/reply`)
    .then((res) => {
        setReplies(res.data)
    })
})

const [reaction , setReaction] = useState({})

let dispatch = useDispatch()

useEffect(() => {
    axios.get(`${API}/users/${posts.creator.username}/posts/${posts.id}/reactions`)
    .then((res) => {
      setReaction(res.data);
    });
  }, [posts.id]);



function formatDate(inputDate){
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

    const [month, day, year] = inputDate.split("/").map(Number);
    const formattedMonth = months[month - 1]
    const formattedYear = year.toString()

    return `${formattedMonth} ${day}, ${formattedYear}`
}


function highlightMentions(content) {
    const mentionPattern = /@(\w+)/g;
    const hashtagPattern = /#(\w+)(?=\W|$)/g;
    
    const highlightedContent = content
    .replace(mentionPattern, '<span class="mention">$&</span>')
    .replace(hashtagPattern, `<span class="hashtag" style="color: blue;">$&</span>`)
    .replace(/\n/g, '<br>')
    return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
}





function handleAddFav(e){
    e.preventDefault()
    axios.post(`${API}/favorites/${mainUser?.id}/fav/${posts.id}`, fav)
    .then(() => {
        axios.get(`${API}/favorites/${mainUser.id}`)
        .then((res) => {
          setFavorites(res.data)
        })
    })
}

function handleDeleteFav(e){
    e.preventDefault()
    axios.delete(`${API}/favorites/${mainUser.id}/delete/${posts.id}`)
    .then(() => {
        axios.get(`${API}/favorites/${mainUser.id}`)
        .then((res) => {
          setFavorites(res.data)
        })
    })
}


function handleLike(e){
    e.preventDefault()
    axios.post(`${API}/users/${posts.creator.username}/posts/${mainUser.id}/react/${posts.id}`, likes)
    .then(() => {
        axios.get(`${API}/users/${posts.creator.username}/posts/${posts.id}/reactions`)
        .then((res) => {
          setReaction(res.data);
        });
    })
}

function handleDislike(e){
    e.preventDefault()
    axios.post(`${API}/users/${posts.creator.username}/posts/${mainUser.id}/react/${posts.id}`, dislike)
    .then(() => {
        axios.get(`${API}/users/${posts.creator.username}/posts/${posts.id}/reactions`)
        .then((res) => {
          setReaction(res.data);
        });
    })
}

function createRepost (e){
    e.preventDefault()
    axios.post(`${API}/users/${mainUser.username}/posts/${mainUser.username}/repost/${posts.id}`, {user_id: posts.user_id})
    .then(() => {
        axios.put(`${API}/users/${posts.creator.username}/posts/${posts.id}`, {repost_counter: posts.repost_counter += 1})
    })
}

const inFav = Array.isArray(favorites) ? favorites.map((fav) => fav?.id) : [];



    return(
        <div className="posts_content">
             {posts.repost ? <span className="repost_style"><PiArrowsClockwise size={15} color="gray"/> {posts.user_name} reposted</span> : null}
            <div className="posts_extra_container">

            <div className="post_user_profile_container">
            <img
            src={posts.creator.profile_img}
            alt={posts.creator.profile_img}
            className="post_user_profile"
            />
            </div>

        <div className="post_user_info_date_container">

        <div  className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} post_user_profile`} >

        {posts.creator.profile_name} | @{posts.creator.username} | {formatDate(posts.time)}

        </div>

            <Link to={`/posts/${posts.creator.username}/${posts?.id}`} className="link-style">
        <div className="posts_content_text_container">
            {!posts.content ? null : 
            <div className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} post_text`}>

               {highlightMentions(posts.content)}
            </div>
            
            }

            {!posts.url ? null : (
            <div className={`embedded_link_container ${mainUser?.dark_mode ? 'light_text' : 'dark_text'}`}>
            <a href={posts.url} target="_blank">
                <img src={posts.url_img} className="post_article_img" alt={`${posts.url_title}`} />
            </a>
             <span className="url_title">{posts.url_title}</span>
            </div>
                
            )}
            <div className="posts_img_container">
            {posts.posts_img === "null" ? null : (

                <img src={posts.posts_img} alt={posts.posts_img} className="posts_img"/>
            )}

            </div>
        
         </div>
        </Link>
         
         </div>

            </div>
            
         
         <div className="posts-options-container">

         <div className="posts-reply-button">
  <button className={`${mainUser?.dark_mode ? 'white_option_btn' : 'dark_option_btn'} no_br reply_btn`}  onClick={(e) => { e.preventDefault(); setShow(true); }}>
    <SlBubble size={20} /> {replies.length}
    <span className="hidden-text">Reply</span>
  </button>
</div>

<div className="repost-button">
<button className={`${mainUser?.dark_mode ? 'white_option_btn' : 'dark_option_btn'} no_br fav_btn`} 
onClick={createRepost}><PiArrowsClockwise size={20}/> {posts.repost_counter}
 <span className="hidden-text">Repost</span>
 </button>
</div>

             <div className="favorite_posts_container">
                {mainUser && inFav.includes(posts?.id) ? 
                <button className={`${mainUser?.dark_mode ? 'white_option_btn' : 'dark_option_btn'} no_br fav_btn`} onClick={handleDeleteFav}><AiFillHeart size={20} color="red"/>
                <span className="hidden-text">Disike</span>
                </button>

                : <button className={`${mainUser?.dark_mode ? 'white_option_btn' : 'dark_option_btn'} no_br fav_btn`} onClick={handleAddFav}><AiOutlineHeart size={20}/>
                <span className="hidden-text">Like</span>
                </button>}

            </div> 

            
            <div className="like-container">
            <button className={`${reaction?.dislikeId?.includes(mainUser?.id) ? 'green_option_btn' : `${mainUser.dark_mode ? "light_outline" : "dark_outline"}`} no_br react_btn`} onClick={handleLike}><AiOutlineLike size={20} /> {reaction.likes}
            <span className="hidden-text">Like</span>
            </button>
           
            </div>
            
            
      
            <div className="dislike-container">
            <button className={`${reaction?.dislikeId?.includes(mainUser?.id) ? 'red_option_btn' : `${mainUser.dark_mode ? "light_outline" : "dark_outline"}`} no_br react_btn`} onClick={handleDislike}><AiOutlineDislike size={20}/> {reaction.dislikes}
            <span className="hidden-text">Dislike</span>
            </button>
            </div> 

            <ReplyForm open={show} onClose={() =>  setShow(false)} users={mainUser} posts={posts} plan={plan} mainUser={mainUser}/>
         </div>
         
         </div>

         )
        }
        
        
        export default HomePost
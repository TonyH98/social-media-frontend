import {AiFillHeart} from "react-icons/ai"
import {AiOutlineHeart} from "react-icons/ai"
import { useEffect , useState, useRef } from "react";
import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai"

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function RepliesNote({notes , users, mainUser}){

    let [favorites , setFavorites] = useState([])

    
    let [isVisible , setIsVisible] = useState(false)
    const notificationRef = useRef(null)

    let [fav] = useState({
        creator_id: notes.sender_id
    })
    
    let [likes] = useState({
        reaction: "like",
        creator_id: notes.sender_id
    })
    
    let [dislike] = useState({
        reaction: "dislike",
        creator_id: notes.sender_id
    })
  
    const [reaction , setReaction] = useState({})

    
    useEffect(() => {
        axios.get(`${API}/users/${notes.post_content.username}/posts/${notes.post_content.posts_id}/reply/${notes.reply_id}/reactionsR`)
        .then((res) => {
          setReaction(res.data);
        });
      }, [notes.reply_id]);

      useEffect(() => {
        axios.get(`${API}/favorites/${mainUser.id}/replies`)
        .then((res) => {
            setFavorites(res.data)
        })
      }, [mainUser.id])

    function highlightMentions(content) {
        const mentionPattern = /@(\w+)/g;
        const hashtagPattern = /#(\w+)(?=\W|$)/g;
        
        const highlightedContent = content
        .replace(mentionPattern, '<span class="mention">$&</span>')
        .replace(hashtagPattern, `<span class="hashtag" style="color: blue;">$&</span>`)
        return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
    }

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

    function handleLike(e){
        e.preventDefault()
        axios.post(`${API}/users/${notes.post_content.username}/posts/${notes.post_content.posts_id}/reply/${mainUser.id}/reactR/${notes.reply_id}`, likes)
        .then(() => {
            axios.get(`${API}/users/${notes.post_content.username}/posts/${notes.post_content.posts_id}/reply/${notes.reply_id}/reactionsR`)
            .then((res) => {
              setReaction(res.data);
            });
        })
    }
    
    function handleDislike(e){
        e.preventDefault()
        axios.post(`${API}/users/${notes.post_content.username}/posts/${notes.post_content.posts_id}/reply/${mainUser.id}/reactR/${notes.reply_id}`, dislike)
        .then(() => {
            axios.get(`${API}/users/${notes.post_content.username}/posts/${notes.post_content.posts_id}/reply/${notes.reply_id}/reactionsR`)
            .then((res) => {
              setReaction(res.data);
            });
        })
    }

    function handleAddFav(e){
        e.preventDefault()
        axios.post(`${API}/favorites/${mainUser.id}/favR/${notes.reply_id}`, fav)
        .then(() => {
            axios.get(`${API}/favorites/${mainUser.id}/replies`)
            .then((res) => {
            setFavorites(res.data)
        })
        })
    }
    
    function handleDeleteFav(e){
        e.preventDefault()
        axios.delete(`${API}/favorites/${mainUser.id}/deleteR/${notes.reply_id}`)
        .then(() => {
            axios.get(`${API}/favorites/${mainUser.id}/replies`)
            .then((res) => {
            setFavorites(res.data)
        })
        })
    }

    function marketRead (){
        axios.put(`${API}/notifications/${notes?.id}`, {is_read: !notes.is_read})
        .then((res) => {
            console.log("response from the api,", res.data)
        })
        .catch((err) => {
            console.log('error', err)
        })
    }

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5
        }

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
          }, options);


         if(notificationRef.current){
            observer.observe(notificationRef.current)
         }
         
         return () => {
            if(notificationRef.current){
                observer.unobserve(notificationRef.current)
            }
         }
    })

    useEffect(() => {
        if (isVisible) {
          marketRead();
        }
      }, [isVisible]);

      console.log(notes)
    const inFav = Array.isArray(favorites) ? favorites.map((fav) => fav?.reply_id) : [];
    return(

        <div className="posts_content" ref={notificationRef}>

        <div className="posts_extra_container">

        <div className="post_user_profile_container">
        <img
        src={notes.post_content.profile_img}
        alt={notes.post_content.profile_img}
        className="post_user_profile"
        />
        </div>

    <div className="post_user_info_date_container">

    <div className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} post_user_profile`}>

    {notes.post_content.profile_name} | @{notes.post_content.username} | {formatDate(notes.post_content.date_created)}

    </div>

        
    <div className="posts_content_text_container">

        <div className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} post_text`}>

           {highlightMentions(notes.post_content.content)}
        </div>
        {!notes.url ? null : (
            <div className={`embedded_link_container ${mainUser?.dark_mode ? 'light_text' : 'dark_text'}`}>
            <a href={notes.url} target="_blank">
                <img src={notes.url_img} className="post_article_img" alt={`${notes.url_title}`} />
            </a>
             <span className="url_title">{notes.url_title}</span>
            </div>
                
            )}
         <div className="posts_img_container">
        {notes.post_content.post_img === "null" ? null : (

            <img src={notes.post_content.post_img} alt={notes.post_content.post_img} className="posts_img"/>
        )}
  {notes.creator.gif ? <img src={notes.creator.gif} alt={notes.creator.gif} className="gif_img"/> : null}
        </div> 
    
     </div>

     
     </div>

        </div>
        <div className="posts-options-container">





<div className="favorite_posts_container">
   {mainUser && inFav.includes(notes?.reply_id) ? 
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


</div>
     </div>

    )
}


export default RepliesNote
import { useState , useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {createRplies}  from "../../Store/userActions";
import "./Reply.css"
function ReplyForm({open , onClose, users, posts, plan }){

  const dispatch = useDispatch()

  let [replies, setReplies] = useState({
    content: "",
    posts_img: null,
    user_id: users?.id,
    posts_id: posts.id, 
    })

    useEffect(() => {
      if (users?.id && posts?.id) {
        setReplies((prevReplies) => ({
          ...prevReplies,
          user_id: users?.id,
          posts_id: posts?.id
        }));
      }
    }, [users?.id, posts?.id]);



    function formatDate(inputDate){
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
    
        const [month, day, year] = inputDate.split("/").map(Number);
        const formattedMonth = months[month - 1]
        const formattedYear = year.toString().slice(-2)
    
        return `${formattedMonth} ${day}, ${formattedYear}`
    }

    function highlightMentions(content) {
        const mentionPattern = /@(\w+)/g;
        const hashtagPattern = /#(\w+)(?=\W|$)/g;
        
        const highlightedContent = content
        .replace(mentionPattern, '<span class="mention">$&</span>')
        .replace(hashtagPattern, `<span class="hashtag" style="color: blue;">$&</span>`)
        return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
    }


    const handleTextChange = (event) => {
      if(event.target.id === "posts_img"){
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
            setReplies({...replies, posts_img: reader.result})
        }
        reader.readAsDataURL(file)
    }
      else if(plan?.images){
        const {value} = event.target
        if(value.length <=400){
          setReplies((prevEvent) => ({
            ...prevEvent,
            content: value,
          }));
        } 
        else{
          event.target.value = value.substr(0,400)
        }

      }
      else{
        const {value} = event.target
        if(value.length <=250){
          setReplies((prevEvent) => ({
            ...prevEvent,
            content: value,
          }));
        } 
        else{
          event.target.value = value.substr(0,250)
        }
      }
    };


    const handleSubmit = (event) => {
      event.preventDefault()
      const formData = new FormData();
        formData.append("content", replies?.content);
        formData.append("posts_img", replies.posts_img === "" ? null : replies.posts_img);
        formData.append("user_id", users?.id);
        formData.append("posts_id", posts.id)
      dispatch(createRplies(users?.username, posts.id, formData))
      .then((res) => {
        onClose()
        setReplies({
          content: "",
          user_id: users?.id,
          posts_id: posts.id, 
        })
      })
    }

    const handleTextareaClick = (event) => {
      event.preventDefault()
  };


  
if(!open) return null

    return(
        <div className="overlay">
           <div className="modal-container">
            <div className="modalLeft">
            <button className="onClose" onClick={onClose}>X</button>
            </div>
           <div className="content">
           <div className="posts_content">

<div className="posts_extra_container">

<div className="post_user_profile_container">
<img
src={posts.creator.profile_img}
alt={posts.creator.profile_img}
className="post_user_profile"
/>
</div>

<div className="post_user_info_date_container">

<div className="post_user_profile">

{posts.creator.profile_name} | @{posts.creator.username} | {formatDate(posts.time)}

</div>


<div className="posts_content_text_container">

<div className="post_text">

   {highlightMentions(posts.content)}
</div>
<div className="posts_img_container">
{posts.posts_img === "null" ? null : (

    <img src={posts.posts_img} alt={posts.posts_img} className="posts_img"/>
)}

</div>


</div>


</div>

</div>


</div>


<form  className="signup-form" onSubmit={handleSubmit}>

<h2>Reply Back:</h2>

<div className='input-container'>
  
  <label htmlFor="content" className='label-signup'>Post:
  <textarea
    id="content"
    required
    value={replies.content}
    onChange={handleTextChange}
    onClick={handleTextareaClick}
  />
    <p className={`${plan?.images ? 
    (replies?.content.length >= 400 ? 'text-red-700' : null) 
    : (replies?.content.length >= 250 ? 'text-red-700' : null)}`}>
  {replies?.content.length} / {plan?.images ? 400 : 250} characters
</p>
  </label>

  <label htmlFor="posts_img" className='label-signup'>
          Post Image
          <input
            key={replies.imageKey}
            id="posts_img"
            name="posts_img"
            type="file"
            className="file-input"
            accept=".png, .jpg, .jpeg"
            onChange={handleTextChange}
          />
        </label>

</div>


  <button type='submit'>Post</button>

</form>


           </div>

           </div>
        </div>
    )


}


export default ReplyForm
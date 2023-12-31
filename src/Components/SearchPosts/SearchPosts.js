import { useDispatch , useSelector } from "react-redux";
import { getSearchPost , getSearchReplies } from "../../Store/userActions";
import { useParams } from "react-router-dom";
import { useEffect , useState } from "react";
import TagPosts from "./tagPosts";
import TagReplies from "./tagReplies";
import AllSearch from "./AllSearch";
import "./SearchPosts.css"
import axios from "axios";


const API = process.env.REACT_APP_API_URL;
function SearchPosts({mainUser, plan}){

const {tag_name} = useParams()

let [option , setOption] = useState(0)
let options = ["Posts", "Replies", "All"]
let [allSearch , setAllSearch] = useState([])


const dispatch = useDispatch();

const getPosts = useSelector((state) => state.get_search.searchPost);
const getReplies = useSelector((state) => state.search2.search)


useEffect(() => {
dispatch(getSearchPost(tag_name))
dispatch(getSearchReplies(tag_name))
}, [dispatch, tag_name])


useEffect(() => {
axios.get(`${API}/search/all/${tag_name}`)
.then((res) => {
  setAllSearch(res.data)
})

}, [tag_name])




function optionContent(selected) {
    if (selected === 0) {
      return (
        <div className={`option-content-holder ${mainUser.dark_mode ? "light_border_post" : "dark_border_post"}`}>
          {getPosts.map((tag) => {
            return (
              <div  className="posts-border-container">
                <TagPosts  tag={tag} mainUser={mainUser} plan={plan}/>
              </div>
            );
          })}
        </div>
      );
    }
    if(selected === 1){
      return (
        <div className={`option-content-holder ${mainUser.dark_mode ? "light_border_post" : "dark_border_post"}`}>
          {getReplies.map((tag) => {
            return (
              <div  className="posts-border-container">
                <TagReplies tag={tag} mainUser={mainUser} plan={plan}/>
              </div>
            );
          })}
        </div>
      );
    }
  if(selected === 2){
    return (
      <div className={`option-content-holder ${mainUser.dark_mode ? "light_border_post" : "dark_border_post"}`}>
        {allSearch.map((tag) => {
          return (
            <div  className="posts-border-container">
              <AllSearch tag={tag} mainUser={mainUser} plan={plan}/>
            </div>
          );
        })}
      </div>
    );
  }
    
  }


  


    return(
      <div className="search_post_page">
        <div className="search_post_first_section">
            <div className="tag_name_container">
                {/* <h1 className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>{allSearch[0]?.tag_names}</h1> */}
            </div>
            <div className="search_option_button">
            {options.map((opt , index) => {
                        return(
                    <button onClick={() => setOption(index)} className={`${index === option ? `active options` : 'options'} ${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`} key={index}>{opt}</button>
                        )
                    })}
            </div>
        </div>
    <div className="search_post_second_section">
        {optionContent(option)}
    </div>
      </div>
    )
}

export default SearchPosts
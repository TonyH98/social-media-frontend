import { useParams } from "react-router-dom";
import {getNotifications , fetchUsers, getNotificationsReplies} from "../../Store/userActions";
import { useDispatch , useSelector } from "react-redux";
import { useState, useEffect} from "react";
import Notification from "./Notification";
import RepliesNote from "./RepliesNote";

import "./Notifications.css"


function Notifications({mainUser, plan}){

const [searchFilter, setSearchFilter] = useState('');
const [filterNote, setFilterNote] = useState([]);
const [filterNote2 , setFilterNote2] = useState([])

let [option , setOption] = useState(0)
let options = ["Posts", "Replies"]

const {id} = useParams()

const dispatch = useDispatch();

const note = useSelector((state) => state.note.note)
const noteR = useSelector((state) => state.note2.note2)
const users = useSelector((state) => state.user.users);

useEffect(() => {
  if(id){
    dispatch(fetchUsers(id))
    dispatch(getNotifications(id))
    dispatch(getNotificationsReplies(id))
  }
  
}, [dispatch, id])

const applyFilters = () => {

  if(option === 0){
    let filteredNote = note;
    if (searchFilter) {
      const filterText = searchFilter.toLowerCase();
      filteredNote = filteredNote.filter(
        (notes) =>
          notes.post_content.username.toLowerCase().includes(filterText) || notes.post_content.profile_name.toLowerCase().includes(filterText)
         
      );
    }
    setFilterNote(filteredNote)
  }
  if(option === 1){
    let filteredNote = noteR;
    if (searchFilter) {
      const filterText = searchFilter.toLowerCase();
      filteredNote = filteredNote.filter(
        (notes) =>
          notes.post_content.username.toLowerCase().includes(filterText) || notes.post_content.profile_name.toLowerCase().includes(filterText)
         
      );
    }
    setFilterNote2(filteredNote)
  }

  };




  useEffect(() => {
    applyFilters();
  }, [searchFilter, option, note, noteR]);

  function optionContent(selected) {
    if (selected === 0) {
      return (
        <div>
          {filterNote.map((notes) => {
            return (
              <div  className="posts-border-container">
                <Notification users={users} notes={notes} mainUser={mainUser} plan={plan}/>
              </div>
            );
          })}
        </div>
      );
    }
    if (selected === 1) {
      return (
        <div>
          {filterNote2.map((notes) => {
            return (
              <div  className="posts-border-container">
                <RepliesNote users={users} notes={notes} mainUser={mainUser}/>
              </div>
            );
          })}
        </div>
      );
    }

    
  }
  


    return(
        <div className="note_page">
            <div className="note_first_section">
                <div className="user_name_section">
                    <h1 className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>{users.profile_name}</h1>
                </div>
                <div className="notifications_number_container">
                    <h3 className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>Notifications: {note.length + noteR.length}</h3>
                </div>
                <div className="note_input_bar_container">
                    <label htmlFor="note_input"className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'} label-note`}>
                    Search User:
                    <input
                    id="note_input"
                    type="text"
                    className="note_input"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    </label>
                </div>

                <div className="note_options_button">
                {options.map((opt , index) => {
                     return(
                <button onClick={() => setOption(index)} className={`${index === option ? `active options` : 'options'} ${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`} key={index}>{opt}</button>
                    )
                   })}
                </div>
            </div>

            <div className="note_second_section">
                {note.length === 0 ? 
                <h1 className={`${users?.dark_mode ? 'white_text' : 'dark_text'}`}>No Notifications</h1> : (
                    <div>
                        {optionContent(option)}
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default Notifications
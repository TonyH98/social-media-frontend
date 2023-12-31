import { useNavigate} from "react-router-dom";

import "./LogoutModal.css"

function LogoutModal({open , onClose, mainUser}){

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
    
        fetch("/logout", {
          method: "POST",
          credentials: "include",
        })
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.error(error);
          });
      };


if(!open) return null

    return(
       <div className="overlay">
           <div className={`logout_modal ${mainUser?.dark_mode ? 'modal_backgrond_dark' : 'modal_backgrond_white'}`}>
            
           <div className="logout_content">
            <h1 className={`${mainUser?.dark_mode ? 'white_text' : 'dark_text'}`}>Are you sure you want to logout </h1>
            <div className="logout_buttons_container">
              <button className="logout_button lg_btn" onClick={handleLogout}>Logout</button>
              <button className="logout_cancel_button lg_btn" onClick={onClose}>Cancel</button>
            </div>
           </div>

           </div>
        </div>
    )
}

export default LogoutModal
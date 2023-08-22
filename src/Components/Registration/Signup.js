import { useState , useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUser } from '../../Store/userActions';

import "./Signup.css"


function Signup(){

    const navigate = useNavigate()

   const dispatch = useDispatch();

    const [type, setType]=useState('password');

    const [user, setUser] = useState({
       username: "",
       firstname: "",
       lastname: "",
       email: "",
       profile_img: "https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg",
       banner_img: "https://img.freepik.com/premium-photo/abstract-white-paper-background-texture-watercolor-marbled-painting-chalkboard_364465-65.jpg",
       DOB: "",
       bio: "I am",
       profile_name: "",
       password: ""
      });

      useEffect(() => {
        setUser((prevUser) => ({
          ...prevUser,
          profile_name: prevUser.firstname + " " + prevUser.lastname, // Combine firstname and lastname
        }));
      }, [user.firstname, user.lastname]); // Run this effect whenever firstname or lastname changes
      
      const handleTextChange = (event) => {
        setUser({ ...user, [event.target.id]: event.target.value });
      };


      const handleSubmit = (event) => {
        event.preventDefault();
        try{
          dispatch(createUser(user))
          navigate('/')
        }
        catch(error){
          console.log(error)
        }
      };


      const handleType =() => {
        if(type === 'password'){
          setType('text')
        }
        else if (type === "text"){
          setType('password')
        }
      }

      console.log(user)


      return(
        <div className="signup-section">
    
            
          <form onSubmit={handleSubmit} className="signup-form">

          <h1>Sign Up Form</h1>

          <div className='input-container'>
            
            <label htmlFor="firstname" className='label-signup'>First Name:
            <input
              id="firstname"
              className='signup-input'
              type="text"
              required
              value={user.firstname}
              onChange={handleTextChange}
            />
            
            </label>
      
      
             <label htmlFor="lastname" className='label-signup'>Last Name:
             
            <input
              id="lastname"
              type="text"
              className='signup-input'
              required
              value={user.lastname}
              onChange={handleTextChange}
            />
             </label>
     

            <label htmlFor="username" className='label-signup'>Username:
            
            <input
              id="username"
              className='signup-input'
              value={user.username}
              type="text"
              onChange={handleTextChange}
              
              required
            />
            </label>
            
          
           
         
             <label htmlFor="email" className='label-signup'>Email:
             
            <input
              id="email"
              type="email"
              className='signup-input'
              required
              value={user.email}
              onChange={handleTextChange}
            />
             </label>
       
          <label htmlFor='DOB' className='label-signup'>Date of Birth:
          <input
              id="DOB"
              type="date"
              className='signup-input'
              required
              value={user.DOB}
              onChange={handleTextChange}
            />
          </label>
   
            <label htmlFor="password" className='label-signup'>Password:
     
            <input
              id="password"
              className='signup-input'
              type={type}
              required
              value={user.password}
              placeholder="******"
              onChange={handleTextChange}
              />
            
            </label>
              

          </div>
          
    
            <div className='show-password-container'>

            <input
            type="checkbox"
            onClick={handleType}
            />

            <span >{type === "password" ? "Show Password" : "Hide Password"}</span>

            </div>


            <button type='submit' className='login-submit'>Signup</button>
      
          <Link to="/">
          <button className='sign-btn'>Sign In</button>
          </Link>
    
          </form>
        </div>
    )



}

export default Signup
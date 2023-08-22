import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk"; // Import Redux Thunk
import { userReducer } from "./userReducer";
import { userSignup } from "./userReducer";
import { userLogin } from "./userReducer";
import { userPost } from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  signup: userSignup,
  login: userLogin,
  post: userPost
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;

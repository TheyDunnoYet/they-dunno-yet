import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import feedReducer from "./feedReducer";
import topicReducer from "./topicReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  feed: feedReducer,
  topic: topicReducer,
});

export default rootReducer;

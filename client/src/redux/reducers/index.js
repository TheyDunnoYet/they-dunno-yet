import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import feedReducer from "./feedReducer";
import topicReducer from "./topicReducer";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  feed: feedReducer,
  topic: topicReducer,
  product: productReducer,
});

export default rootReducer;

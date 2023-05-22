import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import feedReducer from "./feedReducer";
import topicReducer from "./topicReducer";
import productReducer from "./productReducer";
import tagReducer from "./tagReducer";
import blockchainReducer from "./blockchainReducer";
import marketplaceReducer from "./marketplaceReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  feed: feedReducer,
  topic: topicReducer,
  tag: tagReducer,
  product: productReducer,
  blockchain: blockchainReducer,
  marketplace: marketplaceReducer,
});

export default rootReducer;

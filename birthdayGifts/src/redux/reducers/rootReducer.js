import { combineReducers } from "redux";

import globalReducer from "./globalReducer";
import userReducer from "./userReducer";
import cardReducer from "./cardReducer"
const rootReducer = combineReducers({
  userReducer,
  globalReducer,
  cardReducer
});

export default rootReducer;

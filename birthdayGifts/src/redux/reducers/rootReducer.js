import { combineReducers } from "redux";

import globalReducer from "./globalReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  userReducer,
  globalReducer,
});

export default rootReducer;

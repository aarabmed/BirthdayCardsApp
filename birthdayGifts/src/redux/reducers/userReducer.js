import { v4 as uuidv4 } from "uuid";

import { USER } from "../defines";

const initialState = {
  currentUser:{}
};

export default function userReducer(state = initialState, action) {

  switch (action.type) {
    case USER.SET_USER:
      return {
        ...state,
        currentUser:{...action.user}
      }

    case USER.REMOVE_USER:
      return {
        ...action,
        currentUser:''
      };
    
    default:
      return state;
  }
}

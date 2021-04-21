import { v4 as uuidv4 } from "uuid";

import { PAGE } from "../defines";

const initialState = {
  pageNumber:1,
  pageSize:12
};

export default function cardReducer(state = initialState, action) {

  switch (action.type) {
    case PAGE.SET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber:action.page
      }

    case PAGE.SET_PAGE_NUMBER:
      return {
        ...state,
        pageSize:action.number
      };
    
    default:
      return state;
  }
}

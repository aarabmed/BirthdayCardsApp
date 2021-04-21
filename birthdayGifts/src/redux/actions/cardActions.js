import { PAGE } from "../defines";

export const setPageNumber = (page) => ({
  type: PAGE.SET_PAGE_NUMBER,
  page,
});

export const setNumberItemsPerPage = (number) => ({
  type: PAGE.SET_NUMBER_ITEMS_PER_PAGE,
  number,
})


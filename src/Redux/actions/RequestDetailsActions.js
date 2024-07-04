import { ADD_REQUEST_DETAILS } from "../ActionTypes";

export const add_request_details = (payload) => {
  return {
    type: ADD_REQUEST_DETAILS,
    payload,
  };
};

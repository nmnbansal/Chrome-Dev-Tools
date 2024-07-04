import { ADD_REQUEST_DETAILS } from "../ActionTypes";

const initialState = {
  requestDetails: [],
};

export const RequestDetailReducers = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case ADD_REQUEST_DETAILS: {
      return {
        ...state,
        requestDetails: [...state.requestDetails, payload],
      };
    }

    default:
      return state;
  }
};

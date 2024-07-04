import { legacy_createStore } from "redux";
import { RequestDetailReducers } from "./reducers/RequestDetailsReducer";

export const store = legacy_createStore(RequestDetailReducers);

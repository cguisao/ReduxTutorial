import { combineReducers } from "@reduxjs/toolkit";
import projectSlice from './slices/project'
import bugSlice  from "./slices/bug";
import userSlice from "./slices/users";

export default combineReducers({
    projects: projectSlice,
    bugs: bugSlice,
    users: userSlice
})
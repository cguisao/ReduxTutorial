import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../actions/api";
import type { AppDispatch, RootState } from "../store";
import moment from "moment";
import type { bug, bugSlice } from "../types/types";

const initialState: bugSlice = {
    list: [],
    loading: false,
    lastFetch: 0
};

const BugSlice = createSlice({
    name: "bugs",
    initialState,
    reducers: {
        bugsRequested: (bugs) => {
            bugs.loading = true
        },
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload
            bugs.loading = false
            bugs.lastFetch = Date.now()
        },
        bugsRequestFailed: (bugs) => {
            bugs.loading = false
        },
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload)
        },
        bugDeleted: (bugs, action) => {
            return {
                list: bugs.list.filter(bug => bug.id !== action.payload.id),
                loading: false,
                lastFetch: 0
            }
        },
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex( b => b.id === action.payload.id)
            if (index !== -1) {bugs.list[index].resolved = true}
        },
        bugAddTeamMember: (bugs, action) => {
            console.log("WE MADE IT TO bugAddTeamMember id: ", action.payload.id)
            const index = bugs.list.findIndex(b => b.id === action.payload.id)
            console.log(bugs.list)
            console.log("index found: ", index)
            if (index !== -1) {
                console.log("WE MADE IT TO bugAddTeamMember")
                bugs.list[index].teamMember = action.payload.teamMember
            }
        }
    }
});

const { bugAdded, bugResolved, bugAddTeamMember, bugsReceived, bugsRequested, bugsRequestFailed } = BugSlice.actions
export default BugSlice.reducer;

// Actions Creators
const url = "/bugs" // this endpoint to should in a configuration file.

export const loadBugs = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetch } = getState().reducer.entities.bugs
    
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

    if (diffInMinutes < 10) return  

    return dispatch(   
        apiCallBegan({
            url,
            onSuccess: bugsReceived.type,
            onStart: bugsRequested.type,
            onError: bugsRequestFailed.type
        }))
}

export const addBugs = (bug: bug) => async (dispatch: AppDispatch) => {
    return dispatch((apiCallBegan({
        url,
        method: "POST",
        data: bug,
        onSuccess: bugAdded.type
    })))
}

export const resolveBug = (bug: bug) => async (dispatch: AppDispatch) => {
    return dispatch(apiCallBegan({
        url: url + "/" + bug.id,
        method: "PATCH",
        data: { resolved: true },
        onSuccess: bugResolved.type
    }))
}

export const assignBugToUser = (bug: bug) => async (dispath: AppDispatch) => {
    return dispath(apiCallBegan({
        url: url + "/" + bug.id,
        method: "PATCH",
        data: { userId: bug.teamMember },
        onSuccess: bugAddTeamMember.type
    }))
}
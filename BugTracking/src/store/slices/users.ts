import { createSlice } from "@reduxjs/toolkit";

interface userTracker {
    id: number;
    user: string
}

const initialState: userTracker[] = []

let lastId =  0

const userSlice = createSlice({
    name: "UserTracker",
    initialState,
    reducers: {
        userAdded: (state, action) => {
            state.push({id: ++lastId, user: action.payload.user})
            console.log("User Added: ", state.length)
        }
    }
})

export const { userAdded } = userSlice.actions
export default userSlice.reducer
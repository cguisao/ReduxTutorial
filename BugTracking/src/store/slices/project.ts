import { createSlice } from "@reduxjs/toolkit";

interface projectTracker {
    id: number,
    name: string
}

const initialState: projectTracker[] = []

let lastId = 0

const projectSlice = createSlice({
    name: "ProjectTracker",
    initialState,
    reducers: {
        projectAdded: (project, action) => {
            project.push({id: ++lastId, name: action.payload.name})
        }
    }
})

export const { projectAdded } = projectSlice.actions
export default projectSlice.reducer
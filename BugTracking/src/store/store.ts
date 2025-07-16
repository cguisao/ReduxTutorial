import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { createSelector } from "@reduxjs/toolkit";
import api from "./middleware/api";

export const createStore = () =>
  configureStore({
    reducer: {
      reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];


// Selector using memomiazion, if the list does not change then
// the logic will not be done again.
export const getUnresolvedBugs = createSelector(
    [
        (state: RootState) => state.reducer.entities.bugs,
        (state: RootState) => state.reducer.entities.projects
    ], 
    (bugs) => bugs.list.filter(bug => !bug.resolved)
)

export const getBugsAassigned = (userId: number) => createSelector(
    [
        (state: RootState) => state.reducer.entities.bugs
    ],
    (bugs) => bugs.list.filter(bug => bug.teamMember === userId)
)
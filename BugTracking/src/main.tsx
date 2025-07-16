import { loadBugs } from './store/slices/bug.ts'
import { createStore, getUnresolvedBugs } from './store/store.ts'

const store = createStore()

// this is an example on how to load bugs
/*
store.dispatch(loadBugs());

setTimeout(() => {
  store.dispatch(loadBugs())
}, 2000);

*/


// store.dispatch(projectAdded({name: "Boostcar"}));

// store.dispatch({
//   type: "error1",
//   payload: { message: "hello world" }
// })

// store.dispatch(projectAdded({name: "Verito"}))
// const unsubscribe = store.subscribe(
//   () => console.log('store changed!', store.getState()))

// store.dispatch(bugAdded({description: "bug 1"}))
// store.dispatch(bugAdded({description: "bug 2"}))
// store.dispatch(bugAdded({description: "bug 3"}))
// store.dispatch(bugAdded({description: "bug 4"}))
// store.dispatch(bugDeleted({id: 1}))

// store.dispatch(bugAdded({description: "Bug 2"}))

//unsubscribe()

// const newUser = store.dispatch(userAdded({
//   user: "Carlos Guisao"
// }))


// console.log(store.getState())

// const save = await store.dispatch(resolveBug({id: 2}))
// console.log(save)
//console.log(store.getState())
await store.dispatch(loadBugs()).then(() => {
  console.log(store.getState().reducer.entities.bugs);
});

const selector1 = await getUnresolvedBugs(store.getState())
// const selector2 = getUnresolvedBugs(store.getState())
console.log(selector1)

//console.log(save)
// store.dispatch(bugAddTeamMember({id: 2, teamMember: 1}))

// console.log(getBugsAassigned(1)(store.getState()))

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </StrictMode>,
// )

import { addBugs, loadBugs, resolveBug } from "../store/slices/bug"
import { createStore, getBugsAassigned, getUnresolvedBugs } from "../store/store"
import MockAdapter from 'axios-mock-adapter';
import axios from "axios";

describe("bug tests", () => {
    let fakeAxios: MockAdapter;
    let store: ReturnType<typeof createStore>;

    const bugsSlice = () => store.getState().reducer.entities.bugs
    const createState = () => ({
            reducer: {
                entities: {
                    bugs: {
                        list: [] as { id: number; resolved?: boolean, teamMember?: number }[],
                        loading: false,
                        lastFetch: 0
                    },
                    projects: [],
                    users: []
                }
            }
        })
    
        beforeEach(() => {
            fakeAxios = new MockAdapter(axios);
            store = createStore()
        });
    
        describe("bugsSlice", () => {
            it("should NOT add a bug to the store if the bug is NOT saved the server", async () => {
                // We should follow AAA which stands for Arrange, Act and Assert
                // Arrange: contains initialization code
                
                const bug = { description: 'a' }
                fakeAxios.onPost('/bugs').reply(500)
                
                // Act: contains what triggers an action
                await store.dispatch(addBugs(bug))

                // Assert: contains the expectation code
                expect(bugsSlice().list).toHaveLength(0)
            }) 

            it("should add a bug to the store if the bug is saved the server", async () => {
                // We should follow AAA which stands for Arrange, Act and Assert
                // Arrange: contains initialization code
                
                const bug = { description: 'a' }
                const savedBug = {...bug, id: 1}
                fakeAxios.onPost('/bugs').reply(200, savedBug)
                
                // Act: contains what triggers an action
                await store.dispatch(addBugs(bug))

                // Assert: contains the expectation code
                expect(bugsSlice().list).toContainEqual(savedBug)
            }) 

            it("should set a bug as resolved", async () => {

                fakeAxios.onPatch('/bugs/1').reply(200, {id: 1, resolved: true})
                fakeAxios.onPost("/bugs").reply(200, {id: 1 })

                await store.dispatch(addBugs({ }))
                await store.dispatch(resolveBug({id: 1}))

                expect(bugsSlice().list[0].resolved).toBe(true)
            })

            it("should NOT set a bug as resolved", async () => {

                fakeAxios.onPatch('/bugs/1').reply(500)
                fakeAxios.onPost("/bugs").reply(200, {id: 1})

                await store.dispatch(addBugs({ }))
                await store.dispatch(resolveBug({id: 1}))
                
                expect(bugsSlice().list[0].resolved).not.toBe(true)
            })
        })

        describe("selectors", () => {

            it("should return bugs where the unresolved status is false", async () => {
                const state = createState()
                state.reducer.entities.bugs.list = [{ id: 1, resolved: true }, { id: 2, resolved: false}, { id: 3, resolved: false }]
                
                const result = getUnresolvedBugs(state)

                expect(result).toHaveLength(2)
            })

            it("should return bugs where bugs have a team member assigned", async () => {
                const state = createState()
                state.reducer.entities.bugs.list = [{id: 1, teamMember: 1}, { id: 2}, { id: 3}]
                
                const result = getBugsAassigned(1)(state)

                expect(result).toHaveLength(1)
            })
        })

        describe("loading bugs", () => {
            describe("if bugs are in the cache", () => {
                it("should not load bugs from the server", async () => {
                    fakeAxios.onGet("/bugs").reply(200, {id: 1});

                    await store.dispatch(loadBugs())
                    await store.dispatch(loadBugs())

                    expect(fakeAxios.history.get.length).toBe(1)
                })
            })
            describe("if bugs are NOT in the cache", () => {
                it("should be fetch from the server", async () => {
                    fakeAxios.onPost("/bugs").reply(200, {id: 1})

                    const storeBugs = await store.dispatch(addBugs({ id: 1 }))
                    const bugs = await store.dispatch(loadBugs())
                    expect(bugs).toEqual(storeBugs)
                })
                describe("loading indicator", () => {
                    it("should be true while while fetching the bugs", () => {
                        fakeAxios.onGet("/bugs").reply(() => {
                            expect(bugsSlice().loading).toBe(true)
                            return [200, [{ id: 1 }]];
                        });
                    })
                    it("should not be true while while fetching the bugs", async () => {
                        fakeAxios.onGet("/bugs").reply(200, { id: 1});

                        await store.dispatch(loadBugs())

                        expect(bugsSlice().loading).not.toBe(true)
                    })

                    it("should not be false while while fetching the bugs fails", async () => {
                        fakeAxios.onGet("/bugs").reply(500);

                        await store.dispatch(loadBugs())

                        expect(bugsSlice().loading).not.toBe(true)
                    })
                })
            })
        })
})



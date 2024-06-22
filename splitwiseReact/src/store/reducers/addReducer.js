export const addReducer = (state, action) => {
    state.name = action.payload;
}
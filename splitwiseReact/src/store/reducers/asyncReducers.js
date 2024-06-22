import {processedDataReducer} from "./uiReducer";

export const fetchExpenseReducer = (state, action) => {
    state.expenses.expenses = action.payload;
    state.expenses.fetched = true;
    processedDataReducer(state, action);
}

export const fetchGroupsReducer = (state, action) => {
    state.groups = action.payload;
}
export const selectAllExpenses = (state) => {
    return state.expenses.expenses;
}

export const selectExpensesFetched = (state) => {
    return state.expenses.fetched;
}

export const selectAllGroups = (state) => {
    return state.groups;
}

export const selectAllCategories = (state) => {
    return state.categories;
}
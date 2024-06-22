export const defaultState = {
    expenses: {
        expenses: [],
        fetched: false,
    },
    friends: [],
    groups: [],
    categories: [],
    filters: {
        isMonthly: true,
        isShowAllTime: false,
        selectedGroup: null,
        selectedMonth: null,
        startDate: null,
        endDate: null
    }
};
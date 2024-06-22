import {createReducer} from '@reduxjs/toolkit';
import {defaultState} from "../defaultState";
import {addAction} from "../actions/addAction";
import {addReducer} from "./addReducer";
import {fetchExpenses, fetchGroups} from "../actions/asyncActions";
import {fetchExpenseReducer, fetchGroupsReducer} from "./asyncReducers";
import {processedDataAction} from "../actions/uiActions";
import {processedDataReducer} from "./uiReducer";

const actionMap = {
    [addAction.type]: addReducer,
    [fetchExpenses.fulfilled.type]: fetchExpenseReducer,
    [processedDataAction.type]: processedDataReducer,
    [fetchGroups.fulfilled.type]: fetchGroupsReducer,
};

const rootReducer = createReducer(defaultState, (builder) => {
    Object.entries(actionMap).forEach(([action, reducer]) => {
        builder.addCase(action, reducer);
    });
});

export default rootReducer;
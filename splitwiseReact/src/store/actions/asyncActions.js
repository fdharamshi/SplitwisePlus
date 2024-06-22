import {createAsyncThunk} from "@reduxjs/toolkit";
import {getAllExpenses, getAllGroups} from "../../services/SplitwiseAPI";

export const fetchExpenses = createAsyncThunk('fetchExpenses', async (args, thunkAPI) => {
    const allExpenses = await getAllExpenses(window.localStorage.getItem("API_KEY"));
    return allExpenses['expenses'];
});

export const fetchGroups = createAsyncThunk('fetchGroups', async (args, thunkAPI) => {
    const allGroups = await getAllGroups(window.localStorage.getItem("API_KEY"));
    return allGroups['groups'];
});
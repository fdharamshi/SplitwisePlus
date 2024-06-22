import {createAsyncThunk} from "@reduxjs/toolkit";
import {getAllCategories, getAllExpenses, getAllGroups} from "../../services/SplitwiseAPI";

export const fetchExpenses = createAsyncThunk('fetchExpenses', async (args, thunkAPI) => {
    const allExpenses = await getAllExpenses(window.localStorage.getItem("API_KEY"));
    return allExpenses['expenses'];
});

export const fetchGroups = createAsyncThunk('fetchGroups', async (args, thunkAPI) => {
    const allGroups = await getAllGroups(window.localStorage.getItem("API_KEY"));
    return allGroups['groups'];
});

export const fetchCategoriesAction = createAsyncThunk('fetchCategories', async (args, thunkAPI) => {
    let allCategories = await getAllCategories(window.localStorage.getItem("API_KEY"));
    return allCategories;
});
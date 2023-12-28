import axios from "axios";

axios.defaults.headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': 0,
    'Accept': 'application/json',
};

// const BASE_URL = "https://018d-100-35-197-153.ngrok-free.app";
const BASE_URL = "http://127.0.0.1:8000";

export const getRequest = async (API_KEY, url) => {
    let response = await axios
        .post(`${BASE_URL}/forward-get`, {
            "url": url,
            "API_KEY": API_KEY
        });

    return response.data;
}

export const postRequest = async (API_KEY, url, data) => {
    let response = await axios
        .post(`${BASE_URL}/forward-post`, {
            "url": url,
            "API_KEY": API_KEY,
            "postData": data
        });

    return response.data;
}

export const getUser = async (API_KEY) => {
    let user = await getRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/get_current_user");
    return user;
}

export const getAllExpenses = async (API_KEY) => {
    let expense = await getRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/get_expenses?limit=0");

    return expense;
}

export const getTodaysSelfExpenses = async (API_KEY) => {
    const currentDate = new Date();

    // Set the time components to 0 to get midnight (12:00 AM)
    currentDate.setHours(0, 0, 0, 0);
    // currentDate.setDate(3); // TODO: Remove after debugging
    let expense = await getRequest(API_KEY, `https://secure.splitwise.com/api/v3.0/get_expenses?limit=0&dated_after=${currentDate}`);
    return expense;
}

export const getAllGroups = async (API_KEY) => {
    let groups = await getRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/get_groups?limit=0");
    return groups;
}

export const getAllFriends = async (API_KEY) => {
    let groups = await getRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/get_friends");
    return groups;
}

export const createSelfGroup = async (API_KEY) => {
    let group = await postRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/create_group", {
        name: "SELF EXPENSE",
        "group_type": "other"
    });
    return group;
}

export const createSelfExpense = async (API_KEY, description, amount, category_id, group_id) => {
    let expense = await postRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/create_expense", {
        description: description,
        cost: amount,
        category_id: category_id,
        group_id: group_id,
        split_equally: true,
        currency_code: "USD"
    });

    return expense;
}

export const createGroupExpense = async (API_KEY, payload) => {
    let expense = await postRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/create_expense", payload);

    return expense;
}

// export const getGroupExpenses = async (API_KEY, group_id) => {
//     let expenses = await getRequest(API_KEY,)
// }

export const getAllCategories = async (API_KEY) => {
    let categories = await getRequest(API_KEY, "https://secure.splitwise.com/api/v3.0/get_categories");

    return categories;
}
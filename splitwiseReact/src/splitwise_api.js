import axios, * as others from 'axios';

// const API_KEY = "wt4h7bJzdGQEa9KhN6HuCTAwU1eQEoBHxFARO5MZ";
// const config = {
//     headers: { Authorization: `Bearer ${API_KEY}` }
// };

function process_data(data) {
    let expenses = {};
    let categories = {};
    data['expenses'].forEach(expense => {
        if (expense['payment'] === false) {
            const dateStr = expense.date;
            const date = new Date(dateStr);
            const monthYearStr = `${date.toLocaleString('default', { month: 'long' })}${date.getFullYear()}`;
            if (!(monthYearStr in expenses)) {
                expenses[monthYearStr] = {};
            }
            categories[expense['category']['id']] = expense['category']['name'];
            if (!(expense['category']['name'] in expenses[monthYearStr])) {
                expenses[monthYearStr][expense['category']['name']] = 0.0;
            }
            expense['users'].forEach(user => {
                if (user['user']['id'].toString() === "15746973") {
                    expenses[monthYearStr][expense['category']['name']] = expenses[monthYearStr][expense['category']['name']] + parseFloat(user['owed_share']);
                }
            })
        }
    });
    return expenses;
}

export async function fetch_data(API_KEY) {
    const config = {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    };
    // axios
    //     .get("https://secure.splitwise.com/api/v3.0/get_expenses?limit=0", config)
    //     .then((response) => {
    //         let expenses = process_data(response.data);
    //         return expenses;
    //     })
    //     .catch((err) => console.log(err));

    let expenses = await fetch("https://secure.splitwise.com/api/v3.0/get_expenses?limit=0", {
        method: 'GET',
        headers: new Headers({
            Authorization: `Bearer wt4h7bJzdGQEa9KhN6HuCTAwU1eQEoBHxFARO5MZ`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }),
        // mode: 'no-cors'
    }).then(res => {
        return res.json();
    }).then((data) => {
        return process_data(data)['March2023'];
    }).catch((error) => {
        console.log(error)
    });

    return expenses;
}

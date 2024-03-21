export default function process_data(data) {
    let expenses = {};
    let categories = {};
    const localUserId = JSON.parse(window.localStorage.getItem("user"))['user']['id'].toString(); // Retrieve user ID from local storage

    data['expenses'].forEach(expense => {
        if (expense['payment'] === false && expense['deleted_at'] === null && expense['creation_method'] !== "debt_consolidation") {
            const dateStr = expense.date;
            const date = new Date(dateStr);
            const monthYearStr = `${date.toLocaleString('default', {month: 'long'})}-${date.getFullYear()}`;
            if (!(monthYearStr in expenses)) {
                expenses[monthYearStr] = {};
            }
            categories[expense['category']['id']] = expense['category']['name'];
            if (!(expense['category']['name'] in expenses[monthYearStr])) {
                expenses[monthYearStr][expense['category']['name']] = 0.0;
            }
            expense['users'].forEach(user => {
                if (user['user']['id'].toString() === localUserId) {
                    expenses[monthYearStr][expense['category']['name']] = expenses[monthYearStr][expense['category']['name']] + parseFloat(user['owed_share']);
                }
            })
        }
    });
    // console.log(categories);
    // console.log("### ### ###")
    // console.log(expenses);

    return expenses;
}
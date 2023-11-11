export default function process_data(data) {
    let expenses = {};
    let categories = {};
    data['expenses'].forEach(expense => {
        // TODO: Should not be deleted
        if (expense['payment'] === false && expense['deleted_at'] === null) {
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

                // TODO: Use Local Storage User ID

                if (user['user']['id'].toString() === "15746973") {
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
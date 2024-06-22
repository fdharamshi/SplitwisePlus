import './SearchExpense.css';
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectAllExpenses, selectAllGroups} from "../../store/selectors/selectors";

function ExpenseRow({expense, groupName, createdBy, localUserID}) {
    return (
        <div className="expense-row">
            <div className="expense-group">{groupName}</div>
            <div className="expense-description">{expense.description}</div>
            <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
            <div className="expense-cost">${expense.cost}</div>
            <div className="expense-created-by">{createdBy.first_name} {createdBy.last_name}</div>
            <div className="expense-share">My Share: ${expense.users.find(u => u.id = localUserID).owed_share}</div>
        </div>
    );
}

function SearchExpense() {

    const localUserID = JSON.parse(window.localStorage.getItem("user"))['user']['id'];
    const [searchString, setSearchString] = useState("");

    const expenses = useSelector(selectAllExpenses);
    const groups = useSelector(selectAllGroups);

    const searchExpenseFilter = () => {

        const searchWords = searchString.toLowerCase().split(/\s+/);

        // Filter the expenses, keeping only those where every search word is found in the description
        const filteredExpenses = expenses
            .filter(expense => expense['payment'] === false && expense['deleted_at'] === null && expense['creation_method'] !== "debt_consolidation")
            .filter(expense => {
                // Convert the description to lower case for case-insensitive comparison
                const description = expense.description.toLowerCase();

                // Check if every word in the search string is present in the description
                return searchWords.every(word => description.includes(word));
            });

        return filteredExpenses;
    }

    //group_id
    return (<>
        <div>
            <label className="search-label">Item Name:</label>
            <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
            />
        </div>
        {searchExpenseFilter().map(expense =>
            <ExpenseRow
                localUserID={localUserID}
                expense={expense} groupName={groups.find(g => g.id === expense['group_id'])?.name ?? "N/A"}
                createdBy="FD"/>)}
    </>);
}

export default SearchExpense;
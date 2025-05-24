import './SearchExpense.css';
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectAllExpenses, selectAllGroups} from "../../store/selectors/selectors";

function ExpenseRow({expense, groupName, createdBy, localUserID}) {
    // Find the correct share for the local user
    const userShare = expense.users.find(u => u.user.id.toString() === localUserID.toString())?.owed_share || 0;
    const date = new Date(expense.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    return (
        <div className="expense-row">
            <div className="expense-group">
                <span className="label">Group:</span>
                <span className="value">{groupName}</span>
            </div>
            <div className="expense-description">
                <span className="label">Description:</span>
                <span className="value">{expense.description}</span>
            </div>
            <div className="expense-date">
                <span className="label">Date:</span>
                <span className="value">{formattedDate}</span>
            </div>
            <div className="expense-cost">
                <span className="label">Cost:</span>
                <span className="value">${parseFloat(expense.cost).toFixed(2)}</span>
            </div>
            <div className="expense-created-by">
                <span className="label">Created By:</span>
                <span className="value">{createdBy.first_name} {createdBy.last_name}</span>
            </div>
            <div className="expense-share">
                <span className="label">My Share:</span>
                <span className="value">${parseFloat(userShare).toFixed(2)}</span>
            </div>
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
        <div className="expense-header-row">
            <div className="expense-group">Group</div>
            <div className="expense-description">Description</div>
            <div className="expense-date">Date</div>
            <div className="expense-cost">Cost</div>
            <div className="expense-created-by">Created By</div>
            <div className="expense-share">My Share</div>
        </div>
        <div className="expense-results">
            {searchExpenseFilter().map(expense => {
                // Extract creator information directly from the expense object
                // The expense.created_by field contains the complete user information
                const creator = expense.created_by ? {
                    first_name: expense.created_by.first_name || "Unknown",
                    last_name: expense.created_by.last_name || ""
                } : { first_name: "Unknown", last_name: "" };
                
                return (
                    <ExpenseRow
                        key={expense.id}
                        localUserID={localUserID}
                        expense={expense} 
                        groupName={groups.find(g => g.id === expense['group_id'])?.name ?? "N/A"}
                        createdBy={creator}
                    />
                );
            })}
        </div>
    </>);
}

export default SearchExpense;
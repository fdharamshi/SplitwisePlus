import React, {useState} from "react";
import {updateExpenseRequest} from "../services/SplitwiseAPI";
import './ExpenseRow.css';

export const ExpenseRow = (props) => {
    const [selectedCategory, setSelectedCategory] = useState(props.expense['category']['id']);

    const updateExpense = async (selectedCategoryParam) => {
        setSelectedCategory(selectedCategoryParam);

        const payload = {
            cost: props.expense.cost,
            description: props.expense.description,
            group_id: props.expense.group_id,
            category_id: selectedCategoryParam
        }

        let update = await updateExpenseRequest(window.localStorage.getItem("API_KEY"), props.expense.id, payload);
        console.log(update);
    }

    let date = new Date(props.expense.date);
    let formattedDate = date.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'});

    return (
        <div className="ExpenseRow">
            <span className="description">{formattedDate} | {props.expense['description']}</span>
            <div className="category-div">
                <label htmlFor="categoryDropdown" className="category-label">Category:</label>
                <select
                    id="categoryDropdown"
                    className="category-select"
                    value={selectedCategory}
                    onChange={(event) => updateExpense(event.target.value)}
                >
                    <option value="">Select a category</option>
                    {props.categories?.categories.flatMap(mainCategory => mainCategory['subcategories']).map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            <span className="cost">Cost: ${props.expense['cost']}</span>
            <span className="cost">MyShare: ${props.expense['myShare']}</span>
        </div>
    );
};

export default ExpenseRow;
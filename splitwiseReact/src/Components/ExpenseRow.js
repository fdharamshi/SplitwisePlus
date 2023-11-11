import React, {useState} from "react";

export const ExpenseRow = (props) => {
    const [selectedCategory, setSelectedCategory] = useState(props.expense['category']['id']);

    // TODO: Make this editable

    return (
        <div className="ExpenseRow">
            <span className="description">{props.expense['description']}</span>

            <div>
                <label htmlFor="categoryDropdown" className="category-label">Category:</label>
                <select
                    id="categoryDropdown"
                    className="category-select"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                >
                    <option value="">Select a category</option>
                    {props.categories.map((option) => (
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
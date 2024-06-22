import React, {useState} from 'react';
import './BatchExpenseModal.css';
import {createGroupExpense} from "../../services/SplitwiseAPI";

const BatchExpenseModal = ({isOpen, onClose, groupId}) => {
    const [expenseText, setExpenseText] = useState('');
    const [expenseDate, setExpenseDate] = useState(() => {
        return new Date().toISOString().split('T')[0]; // ISO 8601 date part only
    });

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setExpenseText(text);
        } catch (error) {
            console.error('Failed to read clipboard contents: ', error);
        }
    };

    const handleSubmit = () => {
        const expenses = expenseText.split('\n').map(line => {
            const [title, cost] = line.split(',');
            return {title, cost};
        });

        expenses.forEach(({title, cost}) => {
            // console.log({
            //     description: title,
            //     amount: cost,
            //     date: new Date(expenseDate + 'T00:00:00').toISOString(),
            //     group_id: groupId,
            //     split_equally: true,
            //     currency_code: "USD"
            // })
            createGroupExpense(window.localStorage.getItem("API_KEY"), {
                description: title,
                amount: cost.trim(),
                date: expenseDate,
                group_id: groupId,
                split_equally: true,
                currency_code: "USD"
            });
        });

        onClose(); // Close the modal after submitting
    };

    return !isOpen ? null : (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                <div>
                    <button onClick={handlePaste}>Paste</button>
                    <textarea value={expenseText} onChange={(e) => setExpenseText(e.target.value)}/>
                </div>
                <div>
                    <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)}/>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default BatchExpenseModal;

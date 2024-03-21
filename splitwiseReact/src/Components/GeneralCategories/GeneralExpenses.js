import React, {useEffect, useState} from 'react';

import '../SelfExpense.css';
import ExpenseRow from "../ExpenseRow"; // Import the CSS file

// TODO: Get this month's expenses
// TODO: Remove SELF GROUP LOGIC

export const GeneralExpenses = (props) => {

    const [groups, setGroups] = useState({});
    const [selfGroup, setSelfGroup] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('18');
    const [todaysExpenses, setTodaysExpenses] = useState([]);


    const localUser = JSON.parse(window.localStorage.getItem("user"));

    useEffect(() => {
        findTodaysExpense();
    }, []);

    const findTodaysExpense = async () => {
        const getSelfToday = props.allExpenses;
        const todaysEx = [];
        getSelfToday.forEach(expense => {
            if (expense['payment'] === false && expense['deleted_at'] === null && expense['creation_method'] !== "debt_consolidation"
                && expense['category']['id'] === 18 && expense['currency_code'] === "USD") {
                expense['users'].forEach(user => {
                    if (user['user']['id'].toString() === localUser['user']['id'].toString()) {
                        if (user['owed_share'] > 0)
                            todaysEx.push({
                                ...expense,
                                myShare: user['owed_share']
                            });
                    }
                })
            }
        });
        console.log(todaysEx);
        setTodaysExpenses([...todaysEx]);
    }

    return (
        <>
            {todaysExpenses.map(expense => (
                <ExpenseRow key={expense['id']} expense={expense} categories={props.categories}/>
            ))}
        </>
    );
};

export default GeneralExpenses;

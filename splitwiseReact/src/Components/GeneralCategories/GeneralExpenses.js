import React, {useEffect, useState} from 'react';

import '../SelfExpense.css';
import ExpenseRow from "../ExpenseRow";
import {useSelector} from "react-redux";
import {selectAllCategories, selectAllExpenses} from "../../store/selectors/selectors"; // Import the CSS file

// TODO: Get this month's expenses
// TODO: Remove SELF GROUP LOGIC

export const GeneralExpenses = () => {

    const [groups, setGroups] = useState({});
    const [selfGroup, setSelfGroup] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('18');
    const [todaysExpenses, setTodaysExpenses] = useState([]);

    const allExpenses = useSelector(selectAllExpenses);
    const categories = useSelector(selectAllCategories);


    const localUser = JSON.parse(window.localStorage.getItem("user"));

    useEffect(() => {
        findTodaysExpense();
    }, []);

    const findTodaysExpense = async () => {
        const getSelfToday = allExpenses;
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
        setTodaysExpenses([...todaysEx]);
    }

    return (
        <>
            {todaysExpenses.map(expense => (
                <ExpenseRow key={expense['id']} expense={expense} categories={categories}/>
            ))}
        </>
    );
};

export default GeneralExpenses;

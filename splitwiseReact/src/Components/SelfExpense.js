import React, {useEffect, useRef, useState} from 'react';
import {createSelfExpense, createSelfGroup, getAllGroups, getTodaysSelfExpenses} from "../SplitwiseAPI";

import './SelfExpense.css';
import ExpenseRow from "./ExpenseRow"; // Import the CSS file

export const SelfExpense = (props) => {

    const [groups, setGroups] = useState({});
    const [selfGroup, setSelfGroup] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [todaysExpenses, setTodaysExpenses] = useState([]);

    useEffect(() => {
        const localUser = window.localStorage.getItem("user");
        const localApiKey = window.localStorage.getItem("API_KEY");

        handleFetchExpenses();
    }, []);

    const handleFetchExpenses = async () => {
        let groups = await getAllGroups(window.localStorage.getItem("API_KEY"));
        setGroups(groups);
        findSelfGroup();
    };

    const findSelfGroup = () => {
        if (window.localStorage.getItem('group') !== null) {
            setSelfGroup(JSON.parse(window.localStorage.getItem('group')));
            findTodaysExpense();
        } else if (groups['groups'] !== undefined && groups['groups'] !== null) {
            groups['groups'].forEach(group => {
                if (group['name'].toUpperCase() === "SELF EXPENSE" && group['members'].length === 1) {
                    // TODO: Check if client is the member
                    setSelfGroup(group);
                    window.localStorage.setItem("selfgroup", JSON.stringify(group));
                    findTodaysExpense();
                }
            });
        }
    };

    const findTodaysExpense = async () => {
        console.log("called");
        const getSelfToday = (await getTodaysSelfExpenses(window.localStorage.getItem("API_KEY")))['expenses'];
        const todaysEx = [];
        getSelfToday.forEach(expense => {
            if (expense['payment'] === false && expense['deleted_at'] === null) {
                expense['users'].forEach(user => {
                    if (user['user']['id'].toString() === "15746973") {
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

    const createOwnGroup = async () => {
        let group = await createSelfGroup(window.localStorage.getItem("API_KEY"));
        setSelfGroup(group);
    }

    const addSelfExpense = async () => {
        let amount = addExpenseAmount.current.value;
        let description = addExpenseName.current.value;
        let category_id = selectedCategory;
        let added = await createSelfExpense(window.localStorage.getItem("API_KEY"), description, amount, category_id, selfGroup['id']);
        addExpenseAmount.current.value = null;
        addExpenseName.current.value = null;
        setSelectedCategory('');
        console.log(selfGroup['id']);
        console.log(added);
        findTodaysExpense();
    }

    const addExpenseName = useRef(null);
    const addExpenseAmount = useRef(null);

    return (
        <>
            <div className="SelfExpense">
                <div>
                    <h1>Self Expense</h1>
                    {selfGroup['name'] === null && (
                        <button id="createSelfGroupBtn" onClick={createOwnGroup}>
                            Create Self Group
                        </button>
                    )}

                    {/* Add a self expense */}
                    <div className="addExpenseSection">
                        <h3>Add an expense</h3>
                        <div>
                            <label htmlFor="dropdown">Select an Option:</label>
                            <select id="dropdown" value={selectedCategory}
                                    onChange={(event) => setSelectedCategory(event.target.value)}>
                                <option value="">Select an option</option>
                                {props.categories.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input type="text" placeholder="Description" ref={addExpenseName}/>
                        <input type="number" placeholder="Amount" ref={addExpenseAmount}/>
                        <button onClick={addSelfExpense}>Add</button>
                    </div>
                    {/* Show today's expenses */}

                </div>
            </div>
            {todaysExpenses.map(expense => (
                <ExpenseRow key={expense['id']} expense={expense} categories={props.categories}/>
            ))}
        </>
    );
};

export default SelfExpense;

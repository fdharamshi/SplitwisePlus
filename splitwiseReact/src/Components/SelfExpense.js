import React, {useEffect, useRef, useState} from 'react';
import {createSelfExpense, createSelfGroup, getTodaysSelfExpenses} from "../services/SplitwiseAPI";

import './SelfExpense.css';
import ExpenseRow from "./ExpenseRow";
import {useSelector} from "react-redux";
import {selectAllCategories, selectAllExpenses, selectAllGroups} from "../store/selectors/selectors"; // Import the CSS file

export const SelfExpense = () => {

    // const [groups, setGroups] = useState({});
    const [selfGroup, setSelfGroup] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('18');
    const [todaysExpenses, setTodaysExpenses] = useState([]);

    const allExpenses = useSelector(selectAllExpenses);
    const allCategories = useSelector(selectAllCategories);
    const groups = useSelector(selectAllGroups);


    const localUser = JSON.parse(window.localStorage.getItem("user"));

    // useEffect(() => {
    //     handleFetchExpenses();
    // }, []);

    // const handleFetchExpenses = async () => {
    //     // let groups = await getAllGroups(window.localStorage.getItem("API_KEY"));
    //     // setGroups(groups);
    //     findSelfGroup(groups.length > 0 ? groups : props.groups);
    // };

    useEffect(() => {
        if (groups.length > 0) {
            findSelfGroup(groups);
        }
    }, [groups])

    const findSelfGroup = (groups) => {
        if (window.localStorage.getItem('group') !== null) {
            setSelfGroup(JSON.parse(window.localStorage.getItem('group')));
            findTodaysExpense();
        } else if (groups !== undefined && groups !== null) {
            groups.forEach(group => {
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
        const getSelfToday = (await getTodaysSelfExpenses(window.localStorage.getItem("API_KEY")))['expenses'];
        const todaysEx = [];
        console.log(getSelfToday);
        getSelfToday.forEach(expense => {
            if (expense['payment'] === false && expense['deleted_at'] === null && expense['creation_method'] !== "debt_consolidation") {
                expense['users'].forEach(user => {
                    if (user['user']['id'].toString() === localUser['user']['id'].toString()) {
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

    const renderOptions = (categories) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <option value={category.id} disabled style={{fontWeight: 'bold'}}>
                    {category.name}
                </option>
                {category.subcategories && category.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id} style={{paddingLeft: '20px'}}>
                        {sub.name}
                    </option>
                ))}
            </React.Fragment>
        ));
    };

    const addSelfExpense = async () => {

        // TODO: If self group could not be found, alert and do not proceed.

        let amount = addExpenseAmount.current.value;
        let description = addExpenseName.current.value;
        let category_id = selectedCategory;
        let added = await createSelfExpense(window.localStorage.getItem("API_KEY"), description, amount, category_id, selfGroup['id']);
        addExpenseAmount.current.value = null;
        addExpenseName.current.value = null;
        setSelectedCategory('18');
        // console.log(selfGroup['id']);
        // console.log(added);
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
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                {allCategories?.categories && renderOptions(allCategories.categories)}
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
                <ExpenseRow key={expense['id']} expense={expense} categories={allCategories}/>
            ))}
        </>
    );
};

export default SelfExpense;

import '../styles/App.css';
import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import process_data from "../services/data_processor";
import {getAllCategories, getAllExpenses, getAllFriends, getAllGroups, sendEmail} from "../services/SplitwiseAPI";
import ApC from "../ApexCharts/ApC";
import {GroupBalances} from "../Components/Groups";
import AddExpenseModal from "../Components/AddExpenseModal/AddExpenseModal";
import SelfExpense from "../Components/SelfExpense";
import SearchExpense from "../Components/SearchExpense/SearchExpense";
import GeneralExpenses from "../Components/GeneralCategories/GeneralExpenses";

function Dashboard() {

    const [expensesData, setExpensesData] = useState();
    const [allExpenses, setAllExpenses] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState({});
    const [categories, setCategories] = useState([]);

    const [allFriends, setAllFriends] = useState([]);
    const [allGroups, setAllGroups] = useState([]);

    const TabConstants = {
        GROUPS: 0,
        SELFEXPENSE: 1,
        GENERALEXPENSE: 2,
        SEARCHEXPENSE: 3,
    }
    const [currentTab, setCurrentTab] = useState(TabConstants.GROUPS);
    const tabs = ["Outstanding Groups", "Self Expense", "General Expense", "Search Expenses"];

    const getCurrentTab = () => {
        if (currentTab === 0) {
            return (<GroupBalances groupsData={allGroups}/>);
        } else if (currentTab === 1) {
            return (fetched && <SelfExpense categories={categories} groups={allGroups}/>);
        } else if (currentTab === 2) {
            return (fetched && <GeneralExpenses allExpenses={allExpenses} categories={categories}/>)
        } else if (currentTab === 3) {
            return (fetched && <SearchExpense expenses={allExpenses} groups={allGroups}/>)
        } else {
            return (<GroupBalances groupsData={allGroups}/>);
        }
    }

    const navigate = useNavigate();

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!isModalOpen);

    const sendReminders = () => {
        let filteredFriends = allFriends.filter(friend => {
            // Check if 'balance' key exists and it is an array with length > 0
            if (friend.balance && Array.isArray(friend.balance) && friend.balance.length > 0) {
                // Check if the first object in the 'balance' array has an 'amount' key greater than 0.0
                return friend.balance[0].amount > 0.0;
            }
            return false;
        });
        if (filteredFriends.length > 0) {
            filteredFriends.forEach(friend => {
                sendEmail({
                    receiverEmail: friend.email,
                    receiverName: friend.first_name,
                    amount: friend.balance[0].amount
                })
                console.log(`sent to ${{
                    receiverEmail: friend.email,
                    receiverName: friend.first_name,
                    amount: friend.balance[0].amount
                }}`)
            })
        }
    }

    // Function to generate month options for the dropdown
    const generateMonthOptions = () => {
        const months = [];
        for (let i = 0; i < 24; i++) {
            let month = new Date();
            month.setMonth(currentDate.getMonth() - i);
            months.push(`${month.toLocaleString('default', {month: 'long'})}-${month.getFullYear()}`);
        }
        return months.map(month => <option key={month} value={month}>{month}</option>);
    };

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        'Accept': 'application/json',
    };

    const updateExpenses = async () => {
        setFetched(false);
        let allExpenses = await getAllExpenses(window.localStorage.getItem("API_KEY"))
        let expenses = process_data(allExpenses);
        setAllGroups((await getAllGroups(window.localStorage.getItem("API_KEY")))['groups']);
        setAllFriends((await getAllFriends(window.localStorage.getItem("API_KEY")))['friends']);
        setExpensesData(expenses);
        setAllExpenses(allExpenses['expenses']);
        setFetched(true);
    }

    const parseCategories = async () => {
        let allCategories = await getAllCategories(window.localStorage.getItem("API_KEY"));
        // const arrayOfCategories = allCategories['categories'].flatMap(mainCategory => mainCategory['subcategories']);
        setCategories(allCategories);
    }

    useEffect(() => {
        const localUser = window.localStorage.getItem("user");
        const localApiKey = window.localStorage.getItem("API_KEY");
        if (localApiKey === null && localUser === null) {
            navigate('/');
        } else {
            setUser(JSON.parse(localUser));
            updateExpenses();
            parseCategories();
        }
    }, []);

    return (
        <div className="App">
            <div>
                <button className="openModalButton" onClick={toggleModal}>Add Expense</button>
                {/*<button onClick={() => {*/}
                {/*    sendReminders();*/}
                {/*}}>Send Reminders*/}
                {/*</button>*/}
                <AddExpenseModal isOpen={isModalOpen} onClose={toggleModal} groups={allGroups} allFriends={allFriends}/>
                <h1>
                    {user !== null && <div>Expenses For {user?.user?.first_name}</div>}
                </h1>
            </div>

            <select className="monthDropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {generateMonthOptions()}
            </select>

            {fetched && `Total Expense: $${Object.values(expensesData[selectedMonth]).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}`}

            {fetched && ApC({data: expensesData[selectedMonth], month: selectedMonth})}
            {/*<SelfExpense categories={categories} groups={allGroups}/>*/}

            <div className="tabs-container">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        className={`tab ${currentTab === idx ? 'active' : ''}`}
                        onClick={() => setCurrentTab(idx)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {getCurrentTab()}
            {/*{fetched && <SelfExpense categories={categories} groups={allGroups}/>}*/}
            {/*<GroupBalances groupsData={allGroups}/>*/}
        </div>
    );
}

export default Dashboard;

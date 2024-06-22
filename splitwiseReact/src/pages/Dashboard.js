import '../styles/App.css';
import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import process_data from "../services/data_processor";
import {getAllFriends, sendEmail} from "../services/SplitwiseAPI";
import ApC from "../ApexCharts/ApC";
import {GroupBalances} from "../Components/Groups";
import AddExpenseModal from "../Components/AddExpenseModal/AddExpenseModal";
import SelfExpense from "../Components/SelfExpense";
import SearchExpense from "../Components/SearchExpense/SearchExpense";
import GeneralExpenses from "../Components/GeneralCategories/GeneralExpenses";
import BatchExpenseModal from "../Components/BatchExpenseModal/BatchExpenseModal";
import {useDispatch, useSelector} from "react-redux";
import {addAction} from "../store/actions/addAction";
import {fetchCategoriesAction, fetchExpenses, fetchGroups} from "../store/actions/asyncActions";
import {
    selectAllCategories,
    selectAllExpenses,
    selectAllGroups,
    selectExpensesFetched
} from "../store/selectors/selectors";

function Dashboard() {

    const [user, setUser] = useState({});
    const [allFriends, setAllFriends] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState("all");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [dateFilterEnabled, setDateFilterEnabled] = useState(true);
    const [showMonthly, setShowMonthly] = useState(false);
    const [showAllTime, setShowAllTime] = useState(false);

    const dispatch = useDispatch();
    const allExpenses = useSelector(selectAllExpenses);
    const expensesData = process_data({'expenses': allExpenses});
    const fetched = useSelector(selectExpensesFetched);
    const allGroups = useSelector(selectAllGroups);
    const categories = useSelector(selectAllCategories);

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
            return (<GroupBalances/>);
        } else if (currentTab === 1) {
            return (fetched && <SelfExpense/>);
        } else if (currentTab === 2) {
            return (fetched && <GeneralExpenses/>)
        } else if (currentTab === 3) {
            return (fetched && <SearchExpense/>)
        } else {
            return (<GroupBalances/>);
        }
    }

    const navigate = useNavigate();

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!isModalOpen);

    const [batchExpenseModalOpen, setBatchExpenseModalOpen] = useState(false);
    const toggleBatchExpenseModal = () => setBatchExpenseModalOpen(!batchExpenseModalOpen);

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
        // setFetched(false);
        // let allExpenses = await getAllExpenses(window.localStorage.getItem("API_KEY"))
        // setAllGroups((await getAllGroups(window.localStorage.getItem("API_KEY")))['groups']);
        setAllFriends((await getAllFriends(window.localStorage.getItem("API_KEY")))['friends']);
        // setAllExpenses(allExpenses['expenses']);
        // setFetched(true);

        dispatch(fetchExpenses());
        dispatch(fetchGroups());
    }

    const parseCategories = async () => {
        // let allCategories = await getAllCategories(window.localStorage.getItem("API_KEY"));
        // const arrayOfCategories = allCategories['categories'].flatMap(mainCategory => mainCategory['subcategories']);
        // setCategories(allCategories);
    }

    const handleCheckboxChange = (checkboxType) => {
        const isMonthly = checkboxType === "monthly";
        const toggleState = isMonthly ? showMonthly : showAllTime;

        // Toggle the checkbox state based on type
        setShowMonthly(isMonthly ? !toggleState : false);
        setShowAllTime(isMonthly ? false : !toggleState);

        // Set date filtering enabled state based on the new toggle states
        setDateFilterEnabled(!(isMonthly ? !showMonthly : !showAllTime));
    };

    useEffect(() => {
        const localUser = window.localStorage.getItem("user");
        const localApiKey = window.localStorage.getItem("API_KEY");
        if (localApiKey === null && localUser === null) {
            navigate('/');
        } else {
            setUser(JSON.parse(localUser));
            updateExpenses();
            dispatch(fetchCategoriesAction());
        }
    }, []);

    return (
        <div className="App">
            <div>
                <button className="openModalButton" onClick={toggleModal}>Add Expense</button>
                <button className="openModalButton" onClick={toggleBatchExpenseModal}>Batch Expense</button>
                {/*<button onClick={() => {*/}
                {/*    sendReminders();*/}
                {/*}}>Send Reminders*/}
                {/*</button>*/}
                <div className="tabs-container">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            className={`tab ${currentTab === idx ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentTab(idx);
                                dispatch(addAction(tab));
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <AddExpenseModal isOpen={isModalOpen} onClose={toggleModal} groups={allGroups} allFriends={allFriends}/>
                <BatchExpenseModal isOpen={batchExpenseModalOpen} onClose={toggleBatchExpenseModal} groupId="45454507"
                                   allFriends={allFriends}/>
                <h1>
                    {user !== null && <div>Expenses For {user?.user?.first_name}</div>}
                </h1>
            </div>

            {/*<select className="monthDropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>*/}
            {/*    {generateMonthOptions()}*/}
            {/*</select>*/}


            <div className="Dashboard-filter-container">
                <div>
                    <label>Select A Group:</label>
                    <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="all">All Expenses</option>
                        {allGroups.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Start Date:</label>
                    <input type="date" disabled={!dateFilterEnabled} value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div>
                    <label>End Date:</label>
                    <input type="date" disabled={!dateFilterEnabled} value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className="Dashboard-checkbox-container">
                    <label className="Dashboard-checkbox-label">
                        <input type="checkbox" className="Dashboard-checkbox" checked={showAllTime}
                               onChange={() => handleCheckboxChange("allTime")}/>
                        Show all time
                    </label>
                </div>
                <div className="Dashboard-checkbox-container">
                    <label className="Dashboard-checkbox-label">
                        <input type="checkbox" className="Dashboard-checkbox" checked={showMonthly}
                               onChange={() => handleCheckboxChange("monthly")}/>
                        Monthly expense
                    </label>
                    {showMonthly && (
                        <select className="Dashboard-monthDropdown" value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}>
                            {generateMonthOptions()}
                        </select>
                    )}
                </div>
            </div>
            {fetched && `Total Expense: $${Object.values(expensesData[selectedMonth]).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}`}
            {fetched && ApC({data: expensesData[selectedMonth], month: selectedMonth})}

            {getCurrentTab()}
            {/*{fetched && <SelfExpense categories={categories} groups={allGroups}/>}*/}
            {/*<GroupBalances groupsData={allGroups}/>*/}
        </div>
    );
}

export default Dashboard;

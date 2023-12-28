import '../styles/App.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import process_data from "../services/data_processor";
import {getAllCategories, getAllExpenses, getAllFriends, getAllGroups} from "../services/SplitwiseAPI";
import ApC from "../ApexCharts/ApC";
import SelfExpense from "../Components/SelfExpense";
import {GroupBalances} from "../Components/Groups";
import AddExpenseModal from "../Components/AddExpenseModal/AddExpenseModal";

function Dashboard() {

    const [expensesData, setExpensesData] = useState();
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState({});
    const [categories, setCategories] = useState([]);

    const [allFriends, setAllFriends] = useState([]);
    const [allGroups, setAllGroups] = useState([]);

    const navigate = useNavigate();

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!isModalOpen);

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
        let expenses = process_data(await getAllExpenses(window.localStorage.getItem("API_KEY")));
        setAllGroups((await getAllGroups(window.localStorage.getItem("API_KEY")))['groups']);
        setAllFriends((await getAllFriends(window.localStorage.getItem("API_KEY")))['friends']);
        setExpensesData(expenses);
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
                <AddExpenseModal isOpen={isModalOpen} onClose={toggleModal} groups={allGroups} allFriends={allFriends}/>
                <h1>
                    {user !== null && <div>Expenses For {user?.user?.first_name}</div>}
                </h1>
            </div>

            {/*TODO: Render only when everything is fetched*/}

            <select className="monthDropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {generateMonthOptions()}
            </select>

            {fetched && `Total Expense: $${Object.values(expensesData[selectedMonth]).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}`}

            {fetched && ApC({data: expensesData[selectedMonth], month: selectedMonth})}
            <SelfExpense categories={categories} groups={allGroups}/>
            <GroupBalances groupsData={allGroups}/>
        </div>
    );
}

export default Dashboard;

import '../styles/App.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import process_data from "../services/data_processor";
import {getAllCategories, getAllExpenses} from "../services/SplitwiseAPI";
import ApC from "../ApexCharts/ApC";
import SelfExpense from "../Components/SelfExpense";

function Dashboard() {

    const [expensesData, setExpensesData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState({});
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

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
                <h1>Expenses
                    {user !== null && <div>For {user?.user?.first_name}</div>}
                </h1>
                {/*<input type="text" placeholder="Enter something" />*/}
                {/*<button onClick={handleFetchExpenses} disabled={isLoading}>*/}
                {/*  {isLoading ? 'Loading...' : 'Fetch Expenses'}*/}
                {/*</button>*/}
            </div>

            {/*TODO: Render only when everything is fetched*/}

            <select className="monthDropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {generateMonthOptions()}
            </select>

            {fetched && `Total Expense: $${Object.values(expensesData[selectedMonth]).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}`}

            {fetched && ApC({data: expensesData[selectedMonth], month: selectedMonth})}
            <SelfExpense categories={categories}/>
        </div>
    );
}

export default Dashboard;

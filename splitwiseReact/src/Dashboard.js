import './App.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import process_data from "./data_processor";
import {useNavigate} from "react-router-dom";
import {getAllCategories, getAllExpenses} from "./SplitwiseAPI";
import SelfExpense from "./Components/SelfExpense";
import {ApC} from "./ApexCharts/ApC";

function Dashboard() {

    const [expensesData, setExpensesData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState({});
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();


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
        const arrayOfCategories = allCategories['categories'].flatMap(mainCategory => mainCategory['subcategories']);
        setCategories(arrayOfCategories);
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

            {fetched && `Total Expense: $${Object.values(expensesData['October-2023']).reduce((partialSum, a) => partialSum + a, 0)}`}

            {fetched && ApC({data: expensesData['October-2023'], month: "October"})}
            <SelfExpense categories={categories}/>
        </div>
    );
}

export default Dashboard;

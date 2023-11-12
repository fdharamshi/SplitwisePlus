import '../styles/App.css';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {getUser} from "../services/SplitwiseAPI";

function Landing() {

    // wt4h7bJzdGQEa9KhN6HuCTAwU1eQEoBHxFARO5MZ

    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const localUser = window.localStorage.getItem("user");
        const localApiKey = window.localStorage.getItem("API_KEY");
        if (localUser !== null && localApiKey !== null) {
            navigate('/Dashboard');
        }
    }, [user]);

    const handleFetchExpenses = async (API_KEY) => {
        setUser({});
        const retrievedUser = await getUser(API_KEY);

        if (retrievedUser.user !== undefined) {
            setUser(prevUser => ({...retrievedUser}));

            window.localStorage.setItem("user", JSON.stringify(retrievedUser));
            window.localStorage.setItem("API_KEY", API_KEY);
        }
    };

    // TODO: Check if cookies contain the user
    // TODO: Navigate to dashboard if cookies contain the user

    const API_KEY_Input = useRef(null);

    return (
        <div className="App">
            <div>
                <h1>Expenses</h1>
                <h2>Hello {user.user !== undefined ? user.user.first_name : "Invalid API_KEY"}</h2>
                <input type="text" placeholder="Enter API KEY" ref={API_KEY_Input}/>
                <button onClick={() => {
                    handleFetchExpenses(API_KEY_Input.current.value)
                }}>
                    Fetch Expenses
                </button>
            </div>
        </div>
    );
}

export default Landing;

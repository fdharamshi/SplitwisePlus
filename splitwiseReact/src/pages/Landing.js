import './Landing.css';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {getUser} from "../services/SplitwiseAPI";
import DisclaimerModal from "../Components/DisclaimerModal/DisclaimerModal";

function Landing() {

    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

    function openDisclaimerModal() {
        setShowDisclaimerModal(true);
    }

    function closeDisclaimerModal() {
        setShowDisclaimerModal(false);
    }

    const continueToSplitwise = () => {
        closeDisclaimerModal();
        window.location.href = 'https://secure.splitwise.com/apps';
    }

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
            <header className="App-header">
                <h1>Welcome to Splitwise Plus</h1>
                <p>By Femin Dharamshi</p>
                <div>
                    <input type="text" placeholder="Enter Splitwise API key" ref={API_KEY_Input}
                           className="api-key-input"/>
                    <button onClick={() => {
                        handleFetchExpenses(API_KEY_Input.current.value)
                    }}
                            className="continue-button">
                        Continue
                    </button>

                </div>
                <button onClick={openDisclaimerModal} className="dislaimer-button">Click here to get an API key</button>
            </header>
            {
                showDisclaimerModal && (
                    <DisclaimerModal
                        onClose={closeDisclaimerModal}
                        onContinue={continueToSplitwise}
                    />
                )
            }
        </div>
    );
}

export default Landing;

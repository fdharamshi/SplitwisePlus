import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/SplitwiseAPI";
import DisclaimerModal from "../Components/DisclaimerModal/DisclaimerModal";

// Modern, visually appealing styles with gradient background and glassmorphism
const shadcnStyles = `
.landing-root {
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background: linear-gradient(120deg, #191724 0%, #23234a 40%, #3a3a5a 100%);
  color: var(--text-color, #e0e0e0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
  overflow-x: hidden;
  position: relative;
}
.landing-header {
  margin-top: 3.5rem;
  text-align: center;
  z-index: 1;
}
.landing-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 0.7rem;
  background: linear-gradient(90deg, #a5b4fc 10%, #7c3aed 50%, #6366f1 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.landing-author {
  font-size: 1.08rem;
  color: #bdbdbd;
  margin-bottom: 2.2rem;
  letter-spacing: 0.2px;
}
.landing-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: center;
  width: 100%;
  max-width: 410px;
  margin: 0 auto 2.2rem auto;
  z-index: 1;
}
.landing-input {
  width: 100%;
  padding: 0.95rem 1.1rem;
  border-radius: 0.8rem;
  border: 1.5px solid var(--border-color, #333);
  background: rgba(44,44,60,0.7);
  color: var(--text-color, #e0e0e0);
  font-size: 1.08rem;
  outline: none;
  transition: border 0.22s, box-shadow 0.18s;
  box-shadow: 0 2px 12px 0 rgba(80,80,120,0.08);
  backdrop-filter: blur(2.5px);
}
.landing-input:focus {
  border: 1.8px solid #a5b4fc;
  box-shadow: 0 0 0 2px #6366f1aa;
}
.landing-button, .landing-disclaimer-btn {
  padding: 0.85rem 1.7rem;
  border-radius: 0.7rem;
  background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 1.09rem;
  box-shadow: 0 4px 18px rgba(44,44,80,0.16);
  margin-top: 0.6rem;
  transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
  outline: none;
  position: relative;
}
.landing-button:hover, .landing-disclaimer-btn:hover {
  background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
  transform: translateY(-2px) scale(1.035);
  box-shadow: 0 8px 32px rgba(80,80,120,0.2);
}
.landing-button:active, .landing-disclaimer-btn:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(44,44,80,0.14);
}
.landing-disclaimer-btn {
  background: rgba(44,44,60,0.18);
  color: #a5b4fc;
  border: 1.5px solid #6366f1;
  margin-top: 1.1rem;
  font-weight: 600;
}
.landing-disclaimer-btn:focus {
  border: 1.8px solid #a5b4fc;
  box-shadow: 0 0 0 2px #6366f1aa;
}
.advantages-section {
  width: 100%;
  max-width: 540px;
  margin: 2.9rem auto 0 auto;
  background: rgba(44,44,60,0.55);
  border-radius: 1.3rem;
  box-shadow: 0 8px 40px rgba(44,44,80,0.22);
  padding: 2.3rem 1.7rem;
  border: 1.8px solid var(--border-color, #333);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  position: relative;
  z-index: 1;
}
.advantages-title {
  font-size: 1.38rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #a5b4fc;
  letter-spacing: -0.5px;
}
.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.advantage-item {
  display: flex;
  align-items: center;
  gap: 1.05rem;
  margin-bottom: 1.3rem;
  font-size: 1.13rem;
  font-weight: 500;
  color: #e5e7fa;
  letter-spacing: 0.1px;
  transition: color 0.18s;
}
.advantage-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #23234a 60%, #6366f1 100%);
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.35rem;
  color: #fff;
  box-shadow: 0 2px 10px rgba(80,80,140,0.16);
  border: 2px solid #7c3aed44;
  margin-top: 0;
}
.advantage-item:hover {
  color: #a5b4fc;
}
/* Decorative floating gradient blobs */
.landing-gradient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
.landing-gradient-blob--1 {
  width: 340px; height: 340px;
  top: -80px; left: -100px;
  background: radial-gradient(circle, #7c3aed 0%, #23234a 80%);
}
.landing-gradient-blob--2 {
  width: 260px; height: 260px;
  bottom: 40px; right: -90px;
  background: radial-gradient(circle, #6366f1 0%, #23234a 90%);
}
.landing-gradient-blob--3 {
  width: 180px; height: 180px;
  top: 60%; left: 60%;
  background: radial-gradient(circle, #a5b4fc 0%, #23234a 90%);
}
@media (max-width: 600px) {
  .landing-header { margin-top: 1.4rem; }
  .landing-title { font-size: 2.1rem; }
  .advantages-section { padding: 1.1rem 0.5rem; max-width: 99vw; }
  .landing-form { max-width: 99vw; }
}
`;


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
        <div className="landing-root">
            {/* Modern gradient blobs for visual depth */}
            <div className="landing-gradient-blob landing-gradient-blob--1" />
            <div className="landing-gradient-blob landing-gradient-blob--2" />
            <div className="landing-gradient-blob landing-gradient-blob--3" />
            {/* Inject modern styles */}
            <style>{shadcnStyles}</style>
            <header className="landing-header">
                <h1 className="landing-title">Welcome to Splitwise Plus</h1>
                <p className="landing-author">By Femin Dharamshi</p>
                <form className="landing-form" onSubmit={e => { e.preventDefault(); handleFetchExpenses(API_KEY_Input.current.value); }}>
                    <input
                        type="text"
                        placeholder="Enter Splitwise API key"
                        ref={API_KEY_Input}
                        className="landing-input"
                        autoComplete="off"
                        inputMode="text"
                    />
                    <button
                        type="submit"
                        className="landing-button"
                    >
                        Continue
                    </button>
                </form>
                <button
                    onClick={openDisclaimerModal}
                    className="landing-disclaimer-btn"
                    type="button"
                >
                    Click here to get an API key
                </button>
            </header>

            {/* Advantages Section */}
            <section className="advantages-section">
                <div className="advantages-title">Why use Splitwise Plus?</div>
                <ul className="advantages-list">
                    <li className="advantage-item">
                        <span className="advantage-icon" role="img" aria-label="tip">💸</span>
                        Fair tip and tax sharing for every group expense
                    </li>
                    <li className="advantage-item">
                        <span className="advantage-icon" role="img" aria-label="pie">🥧</span>
                        Accurate bill splitting with custom shares
                    </li>
                    <li className="advantage-item">
                        <span className="advantage-icon" role="img" aria-label="bolt">⚡</span>
                        Fast, modern, and mobile-friendly UI
                    </li>
                    <li className="advantage-item">
                        <span className="advantage-icon" role="img" aria-label="moon">🌙</span>
                        Beautiful dark theme for comfortable viewing
                    </li>
                    <li className="advantage-item">
                        <span className="advantage-icon" role="img" aria-label="lock">🔒</span>
                        Your data stays private on your device
                    </li>
                </ul>
            </section>

            {/* Disclaimer Modal */}
            {showDisclaimerModal && (
                <DisclaimerModal
                    onClose={closeDisclaimerModal}
                    onContinue={continueToSplitwise}
                />
            )}
        </div>
    );
}

export default Landing;

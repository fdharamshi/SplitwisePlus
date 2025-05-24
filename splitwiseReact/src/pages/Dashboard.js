import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import process_data from '../services/data_processor';
import { getAllFriends, sendEmail } from '../services/SplitwiseAPI';
import ApC from '../ApexCharts/ApC';
import { GroupBalances } from '../Components/Groups';
import AddExpenseModal from '../Components/AddExpenseModal/AddExpenseModal';
import SelfExpense from '../Components/SelfExpense';
import SearchExpense from '../Components/SearchExpense/SearchExpense';
import GeneralExpenses from '../Components/GeneralCategories/GeneralExpenses';
import BatchExpenseModal from '../Components/BatchExpenseModal/BatchExpenseModal';
import { addAction } from '../store/actions/addAction';
import { fetchCategoriesAction, fetchExpenses, fetchGroups } from '../store/actions/asyncActions';
import {
  selectAllCategories,
  selectAllExpenses,
  selectAllGroups,
  selectExpensesFetched,
} from '../store/selectors/selectors';

// Styled Components
const DashboardContainer = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  min-height: 100vh;
  padding: 24px;
  color: ${({ theme }) => theme.text.primary};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 20px 0 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
  padding-bottom: 4px;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.ui.focusBorder : 'transparent')};
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 6px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.background.button};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.background.buttonHover};
  }
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: ${({ theme }) => theme.shadow.small};
  
  .month-selector {
    margin-bottom: 15px;
    
    select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid ${({ theme }) => theme.ui.border};
      background-color: ${({ theme }) => theme.background.primary};
      color: ${({ theme }) => theme.text.primary};
    }
  }
  
  .total-expense {
    font-size: 1.2em;
    font-weight: bold;
    margin: 10px 0;
    color: ${({ theme }) => theme.text.primary};
  }
`;

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [allFriends, setAllFriends] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFilterEnabled, setDateFilterEnabled] = useState(true);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showAllTime, setShowAllTime] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchExpenseModalOpen, setBatchExpenseModalOpen] = useState(false);
  const dispatch = useDispatch();
  const allExpenses = useSelector(selectAllExpenses);
  const fetched = useSelector(selectExpensesFetched);
  const allGroups = useSelector(selectAllGroups);
  const categories = useSelector(selectAllCategories);
  
  // Get current month and year for the chart title
  const currentDate = new Date();
  const currentMonthYear = `${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`;
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [chartData, setChartData] = useState({});
  
  // Process expenses data
  const expensesData = useMemo(() => {
    const processed = allExpenses ? process_data({ expenses: allExpenses }) : {};
    console.log('Processed expenses data:', processed);
    return processed;
  }, [allExpenses]);
  
  // Debug: Log the data flow
  useEffect(() => {
    if (!allExpenses) return;
    
    console.log('--- EXPENSES DATA DEBUG ---');
    console.log('Raw expenses data:', allExpenses);
    console.log('Processed expenses data:', expensesData);
    console.log('Selected month:', selectedMonth);
    
    if (expensesData && selectedMonth) {
      console.log('Data for selected month:', expensesData[selectedMonth]);
      if (expensesData[selectedMonth]) {
        console.log('Categories:', Object.keys(expensesData[selectedMonth]));
        console.log('Values:', Object.values(expensesData[selectedMonth]));
      }
    }
  }, [allExpenses, expensesData, selectedMonth]);
  
  // Prepare chart data for the selected month
  useEffect(() => {
    console.log('--- PREPARING CHART DATA ---');
    console.log('Raw expenses data:', allExpenses);
    console.log('Processed expenses data:', expensesData);
    console.log('Selected month:', selectedMonth);
    
    if (!expensesData || !selectedMonth) {
      console.log('No expenses data or month selected');
      setChartData({});
      return;
    }
    
    // Get the data for the selected month
    const monthData = expensesData[selectedMonth];
    console.log('Month data for', selectedMonth, ':', monthData);
    
    if (!monthData) {
      console.log(`No data available for month: ${selectedMonth}`);
      setChartData({});
      return;
    }
    
    // Convert the data to the format expected by the chart
    const formattedData = {};
    let hasValidData = false;
    
    console.log('Processing categories:', Object.keys(monthData));
    
    Object.entries(monthData).forEach(([category, amount]) => {
      console.log('Processing category:', category, 'amount:', amount, 'type:', typeof amount);
      const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
      console.log('Parsed amount:', numAmount);
      
      if (!isNaN(numAmount) && numAmount > 0) {
        formattedData[category] = numAmount;
        hasValidData = true;
      }
    });
    
    console.log('Formatted chart data:', formattedData);
    console.log('Has valid data:', hasValidData);
    
    // If no valid data, try to find any month with data
    if (!hasValidData) {
      console.log('No valid data found, checking other months...');
      const allMonths = Object.keys(expensesData);
      console.log('Available months:', allMonths);
      
      for (const month of allMonths) {
        const monthData = expensesData[month];
        console.log(`Checking month ${month}:`, monthData);
        
        if (monthData) {
          for (const [category, amount] of Object.entries(monthData)) {
            const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
            if (!isNaN(numAmount) && numAmount > 0) {
              formattedData[category] = numAmount;
              hasValidData = true;
              console.log(`Found valid data in ${month}:`, { category, amount: numAmount });
            }
          }
          if (hasValidData) {
            console.log(`Found valid data in month: ${month}`);
            break;
          }
        }
      }
    }
    
    console.log('Final chart data to be set:', hasValidData ? formattedData : {});
    setChartData(hasValidData ? formattedData : {});
  }, [expensesData, selectedMonth, allExpenses]);

  const TabConstants = {
    GROUPS: 0,
    SELFEXPENSE: 1,
    GENERALEXPENSE: 2,
    SEARCHEXPENSE: 3,
  };
  
  const [currentTab, setCurrentTab] = useState(TabConstants.GROUPS);
  const tabs = ['Outstanding Groups', 'Self Expense', 'General Expense', 'Search Expenses'];
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const toggleBatchExpenseModal = () => {
    setBatchExpenseModalOpen(!batchExpenseModalOpen);
  };

  const handleLogout = () => {
    window.localStorage.clear();
    navigate('/');
  };

  const sendReminders = async () => {
    try {
      const response = await sendEmail();
      if (response.status === 200) {
        alert('Reminders sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders');
    }
  };

  const generateMonthOptions = () => {
    const months = [];
    const date = new Date();
    
    // Get all available months from the expenses data
    const availableMonths = expensesData ? Object.keys(expensesData).sort().reverse() : [];
    
    // If we have data for specific months, use those
    if (availableMonths.length > 0) {
      return availableMonths.map(month => ({
        value: month,
        label: month
      }));
    }
    
    // Otherwise, generate default options for the last 12 months
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(date);
      monthDate.setMonth(date.getMonth() - i);
      const monthYear = `${monthDate.toLocaleString('default', {month: 'long'})}-${monthDate.getFullYear()}`;
      months.unshift({
        value: monthYear,
        label: monthYear
      });
    }
    
    return months;
  };

  const updateExpenses = () => {
    dispatch(fetchExpenses());
  };

  const parseCategories = () => {
    dispatch(fetchCategoriesAction());
  };

  const handleCheckboxChange = (checkboxType) => {
    if (checkboxType === 'monthly') {
      setShowMonthly(!showMonthly);
      setShowAllTime(false);
    } else if (checkboxType === 'allTime') {
      setShowAllTime(!showAllTime);
      setShowMonthly(false);
    }
  };

  useEffect(() => {
    const localUser = window.localStorage.getItem("user");
    const localApiKey = window.localStorage.getItem("API_KEY");
    
    if (localApiKey === null && localUser === null) {
      navigate('/');
      return;
    }

    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    // Set current month and year
    const currentDate = new Date();
    setSelectedMonth(`${currentDate.toLocaleString('default', {month: 'long'})}-${currentDate.getFullYear()}`);

    // Fetch initial data
    dispatch(fetchExpenses());
    dispatch(fetchGroups());
    dispatch(fetchCategoriesAction());
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      dispatch(fetchExpenses());
    }, 300000); // 5 minutes

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  // Set up axios defaults
  useEffect(() => {
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Fetch friends list
    const fetchFriends = async () => {
      try {
        const friends = await getAllFriends();
        setAllFriends(friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <Title>Splitwise</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <LogoutButton onClick={toggleModal}>Add Expense</LogoutButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </div>
      </Header>
      
      {/* Add the chart at the top of the dashboard */}
      <ChartContainer>
        <div className="month-selector">
          <label htmlFor="month-select" style={{ color: theme.text.primary }}>Select Month: </label>
          <select 
            id="month-select"
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${theme.ui.border}`,
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
              marginLeft: '10px',
              minWidth: '200px'
            }}
          >
            {generateMonthOptions().map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div className="total-expense" style={{ 
            fontSize: '1.2em',
            fontWeight: 'bold',
            margin: '10px 0',
            color: theme.text.primary
          }}>
            {Object.keys(chartData).length > 0 && (
              `Total Expense: $${Object.values(chartData).reduce((sum, val) => sum + val, 0).toFixed(2)}`
            )}
          </div>
          <ApC data={chartData} month={selectedMonth} />
          {Object.keys(chartData).length === 0 && (
            <div className="no-data" style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: theme.text.secondary,
              fontStyle: 'italic',
              marginTop: '20px'
            }}>
              {fetched ? `No expense data available for ${selectedMonth}` : 'Loading expense data...'}
            </div>
          )}
        </div>
      </ChartContainer>

      <TabsContainer>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            $active={currentTab === index}
            onClick={() => {
              setCurrentTab(index);
              dispatch(addAction(tab));
            }}
          >
            {tab}
          </TabButton>
        ))}
      </TabsContainer>

      <ContentContainer>
        {currentTab === TabConstants.GROUPS && (
          <GroupBalances
            groups={allGroups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            startDate={startDate}
            endDate={endDate}
            dateFilterEnabled={dateFilterEnabled}
            setDateFilterEnabled={setDateFilterEnabled}
            showMonthly={showMonthly}
            setShowMonthly={setShowMonthly}
            showAllTime={showAllTime}
            setShowAllTime={setShowAllTime}
            expensesData={expensesData}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        )}
        {currentTab === TabConstants.SELFEXPENSE && (
          <SelfExpense
            startDate={startDate}
            endDate={endDate}
            dateFilterEnabled={dateFilterEnabled}
            setDateFilterEnabled={setDateFilterEnabled}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            expensesData={expensesData}
          />
        )}
        {currentTab === TabConstants.GENERALEXPENSE && (
          <GeneralExpenses
            startDate={startDate}
            endDate={endDate}
            dateFilterEnabled={dateFilterEnabled}
            setDateFilterEnabled={setDateFilterEnabled}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            expensesData={expensesData}
          />
        )}
        {currentTab === TabConstants.SEARCHEXPENSE && (
          <SearchExpense
            startDate={startDate}
            endDate={endDate}
            dateFilterEnabled={dateFilterEnabled}
            setDateFilterEnabled={setDateFilterEnabled}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            expensesData={expensesData}
          />
        )}
      </ContentContainer>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        groups={allGroups}
        allFriends={allFriends}
        categories={categories}
      />
      <BatchExpenseModal
        isOpen={batchExpenseModalOpen}
        onClose={toggleBatchExpenseModal}
        groupId="45454507"
        allFriends={allFriends}
      />
    </DashboardContainer>
  );
};

export default Dashboard;

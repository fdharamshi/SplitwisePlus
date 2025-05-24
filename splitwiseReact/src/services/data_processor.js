export default function process_data(data) {
    console.log('Processing raw data:', data);
    
    // Initialize the expenses object to store data by month
    const expensesByMonth = {};
    const localUserId = JSON.parse(window.localStorage.getItem("user"))?.user?.id?.toString();
    
    if (!localUserId) {
        console.error('No user ID found in local storage');
        return {};
    }

    if (!data?.expenses?.length) {
        console.log('No expenses data provided');
        return {};
    }

    // Process each expense
    data.expenses.forEach(expense => {
        // Skip payments, deleted expenses, and debt consolidations
        if (expense.payment === true || expense.deleted_at !== null || expense.creation_method === "debt_consolidation") {
            return;
        }

        // Parse the expense date
        const expenseDate = new Date(expense.date);
        if (isNaN(expenseDate.getTime())) {
            console.warn('Invalid date for expense:', expense.id, expense.date);
            return;
        }

        // Format the month-year key (e.g., "May-2023")
        const monthYearKey = `${expenseDate.toLocaleString('default', {month: 'long'})}-${expenseDate.getFullYear()}`;
        
        // Initialize the month if it doesn't exist
        if (!expensesByMonth[monthYearKey]) {
            expensesByMonth[monthYearKey] = {};
        }

        // Process each user in the expense
        let userOwedShare = 0;
        if (expense.users && Array.isArray(expense.users)) {
            const user = expense.users.find(u => u.user?.id?.toString() === localUserId);
            if (user) {
                userOwedShare = parseFloat(user.owed_share) || 0;
            }
        }

        // Skip if user doesn't owe anything for this expense
        if (userOwedShare <= 0) {
            return;
        }

        // Get the category name, default to 'Uncategorized' if not available
        const categoryName = expense.category?.name || 'Uncategorized';
        
        // Add the amount to the category total for this month
        expensesByMonth[monthYearKey][categoryName] = (expensesByMonth[monthYearKey][categoryName] || 0) + userOwedShare;
    });

    console.log('Processed expenses by month:', expensesByMonth);
    return expensesByMonth;
}
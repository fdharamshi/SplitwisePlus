import process_data from "../../services/data_processor";

export const processedDataReducer = (state, action) => {

    // TODO: To be removed.

    const expenses = {'expenses': state.expenses.expenses};
    state.processedData = process_data(expenses);
}
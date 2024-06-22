import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer';

const store = configureStore({
    reducer: rootReducer,
    devTools: true
});

export default store;
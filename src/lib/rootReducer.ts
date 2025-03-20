//src/lib/rootReducer.ts
'use client';
import { apiSlice } from '@/utils/apiSlice';
import { combineReducers } from '@reduxjs/toolkit';



const myReducer = (state = null, action: { type: any; }) => {
    switch (action.type) {
        // handle actions if needed
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    myState: myReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;

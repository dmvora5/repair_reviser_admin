import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { userApi } from "./api/users.api"



const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([
        userApi.middleware
    ])
})
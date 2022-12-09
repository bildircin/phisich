import { createSlice } from "@reduxjs/toolkit";


export const walletSlice = createSlice({
    name: "wallet",
    initialState: {
        web3g: {
            walletAddress: "",
            network: "",
            connected: false,
            web3: "",
            provider: "",
            rightChain: false
        },
        pending: false,
        error: false
    },
    reducers: {
        connectionStart: (state) => {
            state.pending = true;
        },
        connectionSuccess: (state, action) => {
            state.pending = false;
            state.web3g = action.payload;
        },
        connectionError: (state) => {
            state.pending = false;
            state.error = true;
        }
    }
})

export const { connectionStart, connectionSuccess, connectionError } = walletSlice.actions;
export default walletSlice.reducer;
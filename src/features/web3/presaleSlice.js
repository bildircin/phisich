import { createSlice } from "@reduxjs/toolkit";

export const stakeSlice = createSlice({
    name: "stake",
    initialState: {
        pStats: {
            totalStakedSeperated: "",
            apr: "",
            dailyRewardSeperated: "",
            tsupdecimalsseperated: "",
            tsupdecimalsseperatedStake: "",
        },
        pspending: false,
        pserror: false
    },
    reducers: {
        psconnectionStart: (state) => {
            state.pspending = true;
        },
        psconnectionSuccess: (state, action) => {
            state.pspending = false;
            state.pStats = action.payload;
        },
        psconnectionError: (state) => {
            state.pspending = false;
            state.pserror = true;
        }
    }
})

export const { psconnectionStart, psconnectionSuccess, psconnectionError } = stakeSlice.actions;
export default stakeSlice.reducer;
import { createSlice } from '@reduxjs/toolkit'

export const airdropSlice = createSlice({
  name: 'abc',
  initialState: {
    singleJson: {}
  },
  reducers: {
    singleAirdropJson: (state, action) => {

      console.log('action')
      console.log(action)
      state.singleJson = { ...state, state: action.payload }
    }
  }
})
// each case under reducers becomes an action
export const { singleAirdropJson } = airdropSlice.actions
export default airdropSlice.reducer
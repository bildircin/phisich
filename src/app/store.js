import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import { userApi } from "../features/userApi";
import { settingApi } from '../features/settingApi'
import { socialApi } from '../features/socialApi';
import { emailSettingsApi } from '../features/emailSettingsApi';
import { galleryApi } from '../features/galleryApi';
import { menuApi } from '../features/menuApi';
import walletReducer from '../features/web3/walletSlice.js';
import stakeReducer from '../features/web3/presaleSlice.js'
import airdropReducer from '../features/web3/airdropSlice.js';
import { addAirdropApi } from '../features/addAirdropApi';




export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [settingApi.reducerPath]: settingApi.reducer,
    [socialApi.reducerPath]: socialApi.reducer,
    [emailSettingsApi.reducerPath]: emailSettingsApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [addAirdropApi.reducerPath]: addAirdropApi.reducer,
    wallet: walletReducer,
    stake: stakeReducer,
    airdropToSingleJson: airdropReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, settingApi.middleware, socialApi.middleware, emailSettingsApi.middleware, galleryApi.middleware, menuApi.middleware, addAirdropApi.middleware)

});


import { combineReducers } from "redux";
import { loadingReducer } from './loadingReducer';
import { walletReducer } from './walletReducer';
import { loginReducer } from './loginReducer';
import * as actionTypes from '../common/actionTypes';
 const appReducer = combineReducers({
    loadingReducer: loadingReducer,
    walletReducer: walletReducer,
    loginReducer: loginReducer
});


const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === actionTypes.RESET_STORE) {
      state = undefined;
    }
  
    return appReducer(state, action);
  };
  
  export default rootReducer;
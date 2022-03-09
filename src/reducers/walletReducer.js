import * as actionTypes from "../common/actionTypes";

const initialState = {
      walletAddress: '',
      walletName: '',
      user: {}
};

export const walletReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SETWALLETADDR:
        return {
            ...state,
            walletAddress: action.payload.walletAddress,
            walletName: action.payload.walletName,
            // user: action.payload.user
        };
        default:
        return state;
    }
}
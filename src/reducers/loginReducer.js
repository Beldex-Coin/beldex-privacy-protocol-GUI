import * as actionTypes from "../common/actionTypes";

const initialState = {
      key: ''
};

export const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGINKEY:
        return {
            ...state,
            key: action.payload
        };
        default:
        return state;
    }
}
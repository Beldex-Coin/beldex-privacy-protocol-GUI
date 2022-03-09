import * as actionTypes from "../common/actionTypes";

const initialState = {
      loading: false
};

export const loadingReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SHOWLOADING:
        return {
            ...state,
            loading: action.payload
        };
        default:
        return state;
    }
}
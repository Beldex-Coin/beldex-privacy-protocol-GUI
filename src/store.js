import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./reducers/index";

const persistConfig = {
    key: 'root',
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const composeEnhancers = compose;
  
  const store = createStore(persistedReducer, composeEnhancers(
    applyMiddleware(thunk)
  ));
  
  export default store;
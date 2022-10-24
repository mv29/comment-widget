import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';

import commentReducer from './comments';
import usersReducer from './user';

const middlewares = [thunk];

// const composeEnhancers =
//   typeof window === 'object' && ['development', 'staging'].includes(window?.ENV_VARS?.mode) && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
//     : compose;

const middlewareEnhancer = applyMiddleware(...middlewares)
const enhancers = [middlewareEnhancer]
const composedEnhancers = composeWithDevTools(...enhancers)

const reducers = combineReducers({
    comments: commentReducer,
    user :usersReducer,
});

const store = createStore(reducers, composedEnhancers);

export default store;

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { type Middleware } from "@reduxjs/toolkit";
import * as actions from "../actions/api";

function isApiCallBeganAction(action: unknown): action is ReturnType<typeof actions.apiCallBegan> {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    (action as any).type === actions.apiCallBegan.type &&
    'payload' in action
  );
}

const api: Middleware = ({ dispatch}) => next => async action => {
     if (!isApiCallBeganAction(action)) return next(action);
    
    const { url, method = 'GET', data, onSuccess, onError, onStart } = action.payload;

    if (onStart) dispatch({ type: onStart })
    
    next(action)

    try {
        const response = await axios.request({
            baseURL: 'http://localhost:9001/api',
            url,
            method,
            data
        })
        // General success
        dispatch(actions.apiCallSuccess(response.data))
        if (onSuccess) {
            dispatch({
                type: onSuccess,
                payload: response.data
            })
        }
    } catch(error: any) {
        // General error action
        dispatch(actions.apiCallFailed(error.message))
        if (onError) {
            dispatch({
                type: onError,
                payload: error.message
            })
        }
    }
};

export default api
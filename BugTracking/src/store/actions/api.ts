import { createAction } from "@reduxjs/toolkit";
import type { ApiCallPayload } from "../types/types";

export const apiCallBegan = createAction<ApiCallPayload>('api/CallBegan');
export const apiCallSuccess = createAction<ApiCallPayload>('api/CallSuccess');
export const apiCallFailed = createAction<ApiCallPayload>('api/CallFailed');
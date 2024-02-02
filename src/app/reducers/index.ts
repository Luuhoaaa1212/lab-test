import { cartReducer } from './cart.reducer';
import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

export interface State {

}
export const reducers: ActionReducerMap<State> = {
  carts:cartReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
